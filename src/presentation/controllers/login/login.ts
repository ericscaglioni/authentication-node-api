import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from './../protocols/controller'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('email')
      }
    }
  }
}
