const Joi = require('joi')

const StrategyInputValidation = data => {
  const Shape = Joi.object().keys({
    name: Joi.string().required(),
    timeEnd: Joi.date()
      .greater('now')
      .required(),
  })
  const result = Joi.validate(data, Shape)
  return result
}

module.exports = StrategyInputValidation
