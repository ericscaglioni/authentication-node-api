import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { badRequest, ok, unauthorized } from '../../helpers/http/http-helpers'
import { EmailValidator, HttpRequest } from '../../protocols'
import { InvalidParamError, MissingParamError, ServerError } from './../../errors'
import { LoginController } from './login'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthenticator = (): Authentication => {
  class AuthenticatorStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticatorStub()
}

interface SutTypes {
  sut: LoginController
  authenticatorStub: Authentication
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticatorStub = makeAuthenticator()
  const sut = new LoginController(authenticatorStub, emailValidatorStub)
  return {
    sut,
    authenticatorStub,
    emailValidatorStub
  }
}

describe('Login Controller', () => {
  test('Should return status code 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return status code 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call email validator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('Should return 400 if provided email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call Authenticator with correct data', async () => {
    const { sut, authenticatorStub } = makeSut()

    const authSpy = jest.spyOn(authenticatorStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()

    jest.spyOn(authenticatorStub, 'auth').mockRejectedValueOnce(new Error('any_error'))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any_error'))
  })

  test('Should return 401 if Authentication failed', async () => {
    const { sut, authenticatorStub } = makeSut()

    jest.spyOn(authenticatorStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
