import { Validator } from './../../protocols'

export class ValidatorComposite implements Validator {
  private readonly validators: Validator[]

  constructor (validators: Validator[]) {
    this.validators = validators
  }

  validate (input: any): Error {
    for (const validator of this.validators) {
      const error = validator.validate(input)
      if (error) {
        return error
      }
    }
  }
}
