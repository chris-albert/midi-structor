import { Either, Schema } from 'effect'
import { AgentMessage, HealthMessage } from '@midi-structor/core'
import { Devices } from './routes/Devices'

export type MessageHandler = (message: AgentMessage) => Either.Either<any, string>

type MessageHandlers<Messages extends { _tag: string }> = {
  [M in Messages as M['_tag']]: (message: M) => Either.Either<any, string>
}

const MessageHandlers: MessageHandlers<AgentMessage> = {
  HealthMessage: (healthMessage: HealthMessage) => {
    return Either.right({ status: 'ok' })
  },
  GetDevicesMessage: Devices.getDevicesMessage,
}

const Handler = () => {
  const handle = (message: any): Either.Either<any, string> => {
    const parsed = Either.mapLeft(Schema.decodeUnknownEither(AgentMessage)(message), (pe) => {
      return `Parse error ${pe.message}`
    })
    return Either.flatMap(parsed, (agentMessage) => {
      const handler = MessageHandlers[agentMessage._tag]
      if (handler !== undefined) {
        return handler(agentMessage as any)
      } else {
        return Either.left(`No routes found for message [${agentMessage._tag}]`)
      }
    })
  }
  return {
    handle,
  }
}

const handler = Handler()

export const Routes = {
  handle: handler.handle,
}
