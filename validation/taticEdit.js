const Joi = require('joi')
const inputTaticValidation = data => {
  const Shape = Joi.object().keys({
    name: Joi.string().required(),
    timeInWeek: Joi.array().required(),
    timeEnd: Joi.date()
      .greater('now')
      .required(),
    description: Joi.string()
      .allow('')
      .optional(),
    strategyId: Joi.string().required(),
  })
  const result = Joi.validate(data, Shape)
  return result
}

module.exports = inputTaticValidation
