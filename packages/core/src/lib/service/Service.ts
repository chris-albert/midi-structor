import { Schema, Either } from 'effect'
import _ from 'lodash'
import { MidiEmitter, MidiListener } from '../midi/GlobalMidi'
import { AgentMidi } from '../midi/AgentMidi'
import { v4 } from 'uuid'
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query'

export namespace Service {
  export const build = <A extends Service>(obj: A): A => obj

  export type Endpoint<Req, Res> = {
    request: Schema.Schema<Req>
    response: Schema.Schema<Res>
  }

  type Service = { [key: string]: Endpoint<any, any> }

  export type Impl<S extends Service> = {
    [Target in keyof S]: (req: S[Target]['request']['Type']) => Promise<S[Target]['response']['Type']>
  }

  export type QueryImpl<S extends Service> = {
    [Target in keyof S as `useQuery${string & Target}`]: (
      req: S[Target]['request']['Type']
    ) => UseQueryResult<S[Target]['response']['Type']>
  } & {
    [Target in keyof S as `useMutate${string & Target}`]: () => UseMutationResult<
      S[Target]['response']['Type'],
      unknown,
      S[Target]['request']['Type']
    >
  }

  export type Handler<S extends Impl<any>, K extends keyof S> = S[K]

  export const Server = <S extends Service>(service: S, impl: Impl<S>) => {
    const handle = (message: any): Promise<any> => {
      const requestId = message.requestId
      const target = message.target
      const endpoint = service[target]
      if (endpoint != undefined) {
        const req = Schema.decodeEither(endpoint.request)(message)
        return Either.match(req, {
          onLeft: (error) => Promise.reject(`Unable to decode request ${error.message}`),
          onRight: (request) => {
            throw new Error('ahhh')
          },
          // impl[target](request).then((r) => ({ requestId, ...r })),
        })
      }
      return Promise.reject(`No routes found for ${target}`)
    }
    return {
      handle,
    }
  }

  export const Client = <S extends Service>(service: S, underlying: (a: any) => Promise<any>): Impl<S> => {
    return _.fromPairs(
      _.map(service, (endpoint, target) => {
        const handler = (
          req: S[typeof target]['request']['Type']
        ): Promise<S[typeof target]['response']['Type']> => {
          console.log('Service.Client', target)
          const obj = {
            target,
            ...req,
          }
          return underlying(obj).then((res) =>
            Either.match(Schema.decodeUnknownEither(endpoint.response)(res), {
              onLeft: (error) => Promise.reject(`Unable to decode response ${error}`),
              onRight: (result) => Promise.resolve(result),
            })
          )
        }
        return [target, handler]
      })
    ) as Impl<S>
  }
  export const Query = <S extends Service>(
    impl: Impl<S>,
    invalidations: { [P in keyof S]?: keyof S }
  ): QueryImpl<S> => {
    return _.fromPairs([
      ..._.map(impl, (handler, target) => {
        const queryHandler = (
          req: S[typeof target]['request']['Type']
        ): UseQueryResult<S[typeof target]['response']['Type']> => {
          return useQuery({
            queryKey: [target, req],
            queryFn: handler,
          })
        }
        return [`useQuery${target}`, queryHandler]
      }),
      ..._.map(impl, (handler, target) => {
        const mutationHandler = (): UseMutationResult<
          S[typeof target]['response']['Type'],
          unknown,
          S[typeof target]['request']['Type']
        > => {
          const queryClient = useQueryClient()
          return useMutation({
            mutationFn: handler,
            onSuccess: () => {
              const invalidation = invalidations[target]
              if (invalidation !== undefined) {
                queryClient.invalidateQueries({ queryKey: [invalidation] })
              }
            },
          })
        }
        return [`useMutate${target}`, mutationHandler]
      }),
    ]) as QueryImpl<S>
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
}
