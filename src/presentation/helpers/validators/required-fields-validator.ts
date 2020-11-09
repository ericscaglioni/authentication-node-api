import { MissingParamError } from './../../errors'
import { Validator } from './../../protocols'

export class RequiredFieldsValidator implements Validator {
  private readonly fieldNames: string[]

  constructor (fieldNames: string[]) {
    this.fieldNames = fieldNames
  }

  validate (input: any): Error {
    for (const fieldName of this.fieldNames) {
      if (!input[fieldName]) {
        return new MissingParamError(fieldName)
      }
    }
  }
}
