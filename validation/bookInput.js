const Joi = require('joi')

const bookInputValidation = data => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    rate: Joi.number()
      .optional()
      .allow(''),
    review: Joi.string()
      .allow('')
      .optional(),
    status: Joi.string()
      .allow('')
      .optional(),
  })
  return Joi.validate(data, schema)
}

module.exports = bookInputValidation
