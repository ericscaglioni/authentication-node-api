import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError } from '../../errors'
import { Controller, EmailValidation, HttpRequest, HttpResponse, Validator } from '../../protocols'
import { badRequest, ok, serverError, unauthorized } from './../../helpers/http/http-helpers'

export class LoginController implements Controller {
  private readonly authenticator: Authentication
  private readonly emailValidator: EmailValidation
  private readonly validator: Validator

  constructor (
    authenticator: Authentication,
    emailValidator: EmailValidation,
    validator: Validator
  ) {
    this.authenticator = authenticator
    this.emailValidator = emailValidator
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
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
