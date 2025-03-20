import { Either, Schema } from 'effect'
import { ParseError } from 'effect/ParseResult'

const parseEither = (str: string): Either.Either<any, string> => {
  try {
    return Either.right(JSON.parse(str))
  } catch (e) {
    return Either.left(`JSON parse error: ${e}`)
  }
}

const parseSchema = <A>(str: string, schema: Schema.Schema<A>): Either.Either<A, string | ParseError> => {
  return Either.flatMap(parseEither(str), Schema.decodeUnknownEither(schema))
}

export const JsonUtil = {
  parseEither,
  parseSchema,
}
