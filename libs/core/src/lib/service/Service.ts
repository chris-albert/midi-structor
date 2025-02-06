import { Option, Schema, Either } from 'effect'
import _ from 'lodash'
import { MidiEmitter, MidiListener } from '../midi/GlobalMidi'
import { AgentMidi } from '../midi/AgentMidi'
import { v4 } from 'uuid'

export type ServiceEndpoint<Req, Res> = {
  request: Schema.Schema<Req>
  response: Schema.Schema<Res>
}

type ServiceEndpointRequest<A> = A extends ServiceEndpoint<infer Req, infer Res> ? Req : never

export type Endpoints = Record<string, ServiceEndpoint<any, any>>

export type Service<E extends Endpoints = any> = {
  target: (input: any) => Option.Option<string>
  endpoints: E
}

type ServiceEndpoints<A> = A extends Service<infer E> ? E : never

// export type ServiceImpl<S extends Service> = {
//   [Target in keyof S['endpoints']]: (
//     req: S['endpoints'][Target]['request']['Type'],
//   ) => Promise<S['endpoints'][Target]['response']['Type']>
// }
export type ServiceImpl<S extends Service<E>, E extends Endpoints = any> = {
  [Target in keyof E]: (req: E[Target]['request']['Type']) => Promise<E[Target]['response']['Type']>
}

export const BuildServer = <S extends Service>(service: S, impl: ServiceImpl<S>) => {
  const handle = (message: any): Promise<any> => {
    const requestId = message.requestId
    return Option.match(service.target(message), {
      onNone: () => Promise.reject(`Unable to decode target from ${message}`),
      onSome: (target) => {
        const endpoint = service.endpoints[target]
        if (endpoint != undefined) {
          const req = Schema.decodeEither(endpoint.request)(message)
          return Either.match(req, {
            onLeft: (error) => Promise.reject(`Unable to decode request ${error.message}`),
            onRight: (request) => Promise.reject(''),
            // impl[target](request).then((r) => ({ requestId, ...r })),
          })
        }
        return Promise.reject(`No routes found for ${target}`)
      },
    })
  }
  return {
    handle,
  }
}

export const BuildClient = <S extends Service>(
  service: S,
  underlying: (a: any) => Promise<any>,
): ServiceImpl<S> => {
  return _.fromPairs(
    _.map(service.endpoints, (endpoint, target) => {
      const handler = (
        req: S['endpoints'][typeof target]['request']['Type'],
      ): Promise<S['endpoints'][typeof target]['response']['Type']> => {
        const obj = {
          target,
          ...req,
        }
        return underlying(obj).then((res) =>
          Either.match(Schema.decodeUnknownEither(endpoint.response)(res), {
            onLeft: (error) => Promise.reject(`Unable to decode response ${error}`),
            onRight: (result) => Promise.resolve(result),
          }),
        )
      }
      return [target, handler]
    }),
  ) as ServiceImpl<S>
}

export const MidiProtocol =
  (emitter: MidiEmitter, listener: MidiListener) =>
  (input: any): Promise<any> => {
    const requestId = v4()
    let cleanup = () => {}
    return new Promise((resolve, reject) => {
      cleanup = listener.on('sysex', (sysex) => {
        Either.match(AgentMidi.parse(sysex), {
          onLeft: (error) => reject(error),
          onRight: (output) => {
            if (output.requestId === requestId) {
              resolve(output)
            }
          },
        })
      })
      emitter.send(AgentMidi.json({ requestId, ...input }))
    }).finally(cleanup)
  }
