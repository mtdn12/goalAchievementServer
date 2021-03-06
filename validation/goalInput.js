const Joi = require('joi')
const goalInputValidation = data => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    timeEnd: Joi.date()
      .greater('now')
      .required(),
    description: Joi.string()
      .allow('')
      .optional(),
  })
  return Joi.validate(data, schema)
}

module.exports = goalInputValidation
