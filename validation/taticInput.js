const Joi = require('joi')
const inputTaticValidation = data => {
  const Shape = Joi.object().keys({
    name: Joi.string().required(),
    timeInWeek: Joi.array().required(),
    timeEnd: Joi.date()
      .greater('now')
      .required(),
    strategyId: Joi.string().required(),
    description: Joi.string()
      .allow('')
      .optional(),
  })
  const result = Joi.validate(data, Shape)
  return result
}

module.exports = inputTaticValidation
