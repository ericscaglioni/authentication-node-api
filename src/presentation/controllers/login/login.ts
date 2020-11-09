import { Authentication } from '../../../domain/usecases/authentication'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../protocols'
import { badRequest, ok, serverError, unauthorized } from './../../helpers/http/http-helpers'

export class LoginController implements Controller {
  private readonly authenticator: Authentication
  private readonly validator: Validator

  constructor (
    authenticator: Authentication,
    validator: Validator
  ) {
    this.authenticator = authenticator
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

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
