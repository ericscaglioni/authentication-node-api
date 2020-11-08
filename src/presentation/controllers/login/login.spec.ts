import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoginController } from './login'

const makeAuthenticator = (): Authentication => {
  class AuthenticatorStub implements Authentication {
    async authenticate (authentication: AuthenticationModel): Promise<string> {
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
    expect(httpResponse.body).toEqual(new Error('email'))
  })

  test('Should return status code 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('password'))
  })

  test('Should call Authenticator with correct data', async () => {
    const { sut, authenticatorStub } = makeSut()

    const authenticatSpy = jest.spyOn(authenticatorStub, 'authenticate')

    const httpRequest: any = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authenticatSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
})
