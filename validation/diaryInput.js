const Joi = require('joi')
const inputDiaryValidation = data => {
  const Shape = Joi.object().keys({
    content: Joi.string().required(),
  })
  const result = Joi.validate(data, Shape)
  return result
}

module.exports = inputDiaryValidation
