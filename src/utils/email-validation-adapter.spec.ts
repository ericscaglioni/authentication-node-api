import validator from 'validator'
import { EmailValidationAdapter } from './email-validation-adapter'

const makeSut = (): EmailValidationAdapter => new EmailValidationAdapter()

describe('Email Validation Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('any_email@mail.com')
    expect(isValid).toBeFalsy()
  })
})
