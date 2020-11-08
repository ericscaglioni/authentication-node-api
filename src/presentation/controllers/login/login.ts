import { Authentication } from '../../../domain/usecases/authentication'
import { MissingParamError } from '../../errors'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { badRequest, serverError } from './../../helpers/http/http-helpers'

export class LoginController implements Controller {
  private readonly authenticator: Authentication

  constructor (authenticator: Authentication) {
    this.authenticator = authenticator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body.email) {
        return badRequest(new MissingParamError('email'))
      }

      if (!httpRequest.body.password) {
        return badRequest(new MissingParamError('password'))
      }

      const { email, password } = httpRequest.body
      await this.authenticator.auth({
        email,
        password
      })
    } catch (err) {
      return serverError(err)
    }
  }
}
