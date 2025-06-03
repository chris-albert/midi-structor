import { SchemaAST, Option } from 'effect'
import { PropertySignature } from 'effect/Schema'

const SchemaFormId = Symbol.for('midi/structor/schema/form/annotation')

const annotation = (name: string) => ({
  [SchemaFormId]: name,
})

const getFormName = (
  ast: SchemaAST.AST | PropertySignature.AST
): Option.Option<string> => {
  if (
    ast._tag === 'PropertySignatureDeclaration' ||
    ast._tag === 'PropertySignatureTransformation'
  ) {
    return Option.none()
  } else {
    return SchemaAST.getAnnotation<string>(SchemaFormId)(ast)
  }
}

export const SchemaForm = {
  annotation,
  getFormName,
}
