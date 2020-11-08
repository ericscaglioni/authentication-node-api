import { LoginController } from './login'

describe('Login Controller', () => {
  test('Should return status code 400 if email is not provided', async () => {
    const sut = new LoginController()
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
    const sut = new LoginController()
    const httpRequest: any = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('password'))
  })
})
