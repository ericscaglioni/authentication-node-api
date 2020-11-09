import { InvalidParamError } from '../../errors'
import { EmailValidation, Validator } from '../../protocols'

export class EmailValidator implements Validator {
  private readonly fieldName: string
  private readonly emailValidation: EmailValidation

  constructor (fieldName: string, emailValidation: EmailValidation) {
    this.fieldName = fieldName
    this.emailValidation = emailValidation
  }

  validate (input: any): Error {
    const isValid = this.emailValidation.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
