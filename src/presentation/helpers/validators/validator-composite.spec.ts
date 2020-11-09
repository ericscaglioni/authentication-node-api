import { MissingParamError } from './../../errors'
import { Validator } from './../../protocols'
import { ValidatorComposite } from './validator-composite'

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  sut: ValidatorComposite
  validatorStubs: Validator[]
}

const makeSut = (): SutTypes => {
  const validatorStubs = [makeValidator(), makeValidator()]
  const sut = new ValidatorComposite(validatorStubs)
  return {
    sut,
    validatorStubs
  }
}

describe('Validator Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validatorStubs } = makeSut()

    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })
})
