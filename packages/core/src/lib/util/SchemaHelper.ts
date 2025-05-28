import { Either, Option, Schema, ParseResult } from 'effect'
const formatError = (parseError: ParseResult.ParseError): string =>
  ParseResult.ArrayFormatter.formatErrorSync(parseError)
    .map((issue) => `${issue.path.join('.')} ${issue.message}`)
    .join('\n')

type DecodeUnknownOps<A, B> = {
  schema: Schema.Schema<A>
  raw: unknown
  ok: (a: A) => B
  error: (s: string) => B
}

type DecodeStringOps<A, B> = {
  schema: Schema.Schema<A>
  str: string
  ok: (a: A) => B
  error: (s: string) => B
}

const decodeUnknown = <A, B>(opts: DecodeUnknownOps<A, B>): B =>
  Either.match(
    Schema.decodeUnknownEither(opts.schema, { errors: 'all' })(opts.raw),
    {
      onRight: opts.ok,
      onLeft: (e) => opts.error(formatError(e)),
    }
  )

const decodeString = <A, B>(opts: DecodeStringOps<A, B>): B =>
  Either.match(
    Schema.decodeUnknownEither(Schema.parseJson(opts.schema), {
      errors: 'all',
    })(opts.str),
    {
      onRight: opts.ok,
      onLeft: (e) => opts.error(formatError(e)),
    }
  )

const encode = <A>(schema: Schema.Schema<A>, a: A): string =>
  Either.match(Schema.encodeEither(schema)(a), {
    onRight: (c) => JSON.stringify(c, null, 2),
    onLeft: (e) => {
      console.error('Error encoding', formatError(e))
      return `Error encoding ${e}`
    },
  })

export const SchemaHelper = {
  decodeUnknown,
  decodeString,
  encode,
}
