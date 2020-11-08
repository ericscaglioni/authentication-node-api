import { Authentication } from '../../../domain/usecases/authentication'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from './../protocols/controller'

export class LoginController implements Controller {
  private readonly authenticator: Authentication

  constructor (authenticator: Authentication) {
    this.authenticator = authenticator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('email')
      }
    }

    if (!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: new Error('password')
      }
    }
    const { email, password } = httpRequest.body
    await this.authenticator.authenticate({
      email,
      password
    })
  }
}
