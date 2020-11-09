import { EmailValidation } from '../../protocols'
import { InvalidParamError } from './../../errors'
import { EmailValidator } from './email-validator'

const makeEmailValidation = (): EmailValidation => {
  class EmailValidationStub implements EmailValidation {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidationStub()
}

interface SutTypes {
  sut: EmailValidator
  emailValidationStub: EmailValidation
}

const makeSut = (): SutTypes => {
  const emailValidationStub = makeEmailValidation()
  const sut = new EmailValidator('email', emailValidationStub)
  return {
    sut,
    emailValidationStub
  }
}

describe('Email Validator', () => {
  test('Should return an error if EmailValidation returns false', () => {
    const { sut, emailValidationStub } = makeSut()
    jest.spyOn(emailValidationStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'invalid_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidation with correct data', () => {
    const { sut, emailValidationStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidationStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
