import { MissingParamError } from '../../errors'
import { RequiredFieldsValidator } from './required-fields-validator'

describe('Required Fiedls Validator', () => {
  test('Should return MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidator(['any_field'])
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new RequiredFieldsValidator(['any_field'])
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})