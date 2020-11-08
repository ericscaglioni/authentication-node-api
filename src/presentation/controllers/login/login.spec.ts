import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { badRequest, ok, unauthorized } from '../../helpers/http/http-helpers'
import { MissingParamError, ServerError } from './../../errors'
import { LoginController } from './login'

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
}

const makeSut = (): SutTypes => {
  const authenticatorStub = makeAuthenticator()
  const sut = new LoginController(authenticatorStub)
  return {
    sut,
    authenticatorStub
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

  test('Should call Authenticator with correct data', async () => {
    const { sut, authenticatorStub } = makeSut()

    const authSpy = jest.spyOn(authenticatorStub, 'auth')

    const httpRequest: any = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()

    jest.spyOn(authenticatorStub, 'auth').mockRejectedValueOnce(new Error('any_error'))

    const httpRequest: any = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any_error'))
  })

  test('Should return 401 if Authentication failed', async () => {
    const { sut, authenticatorStub } = makeSut()

    jest.spyOn(authenticatorStub, 'auth').mockResolvedValueOnce(null)

    const httpRequest: any = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpRequest: any = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
