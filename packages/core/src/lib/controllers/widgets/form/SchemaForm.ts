import { SchemaAST, Option, Schema } from 'effect'
import { PropertySignature } from 'effect/Schema'
import { MidiMessage } from '../../../midi/MidiMessage'

const SchemaFormId = Symbol.for('midi/structor/schema/form/annotation')

const annotation = (name: string) => ({
  [SchemaFormId]: name,
})

const getFormName = (
  ast: SchemaAST.AST | PropertySignature.AST
): Option.Option<string> => {
  if (ast._tag === 'PropertySignatureDeclaration') {
    return Option.fromNullable<string>(ast.annotations[SchemaFormId] as string)
  } else if (ast._tag === 'PropertySignatureTransformation') {
    return Option.none()
  } else {
    return SchemaAST.getAnnotation<string>(SchemaFormId)(ast)
  }
}

const Schemas = {
  Border: Schema.optional(
    Schema.Struct({
      sizePx: Schema.optional(Schema.Number),
      color: Schema.optional(Schema.String),
    })
  ).annotations(annotation('Border')),
  Midi: Schema.Array(MidiMessage.schema).annotations(annotation('MidiMessage')),
}

export const SchemaForm = {
  annotation,
  getFormName,
  Schemas,
}
