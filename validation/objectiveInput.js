const Joi = require('joi')

const ObjectiveValidation = data => {
  const Shape = Joi.object().keys({
    name: Joi.string().required(),
    timeEnd: Joi.date()
      .greater('now')
      .required(),
    goalId: Joi.string().required(),
  })
  const result = Joi.validate(data, Shape)
  return result
}
module.exports = ObjectiveValidation
