import { Authentication } from '../../../domain/usecases/authentication'
import { MissingParamError } from '../../errors'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, ok, serverError, unauthorized } from './../../helpers/http/http-helpers'

export class LoginController implements Controller {
  private readonly authenticator: Authentication
  private readonly emailValidator: EmailValidator

  constructor (
    authenticator: Authentication,
    emailValidator: EmailValidator
  ) {
    this.authenticator = authenticator
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body.email) {
        return badRequest(new MissingParamError('email'))
      }

      if (!httpRequest.body.password) {
        return badRequest(new MissingParamError('password'))
      }

      this.emailValidator.isValid(httpRequest.body.email)

      const { email, password } = httpRequest.body

      const accessToken = await this.authenticator.auth({
        email,
        password
      })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (err) {
      return serverError(err)
    }
  }
}
