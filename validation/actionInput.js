const Joi = require('joi')

const inputActionValidation = data => {
  const Shape = Joi.object().keys({
    action: Joi.string().required(),
    taticId: Joi.string().required(),
  })
  const result = Joi.validate(data, Shape)
  return result
}

module.exports = inputActionValidation
