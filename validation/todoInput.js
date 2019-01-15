const Joi = require('joi')
const inputTodoValidation = data => {
  const Shape = Joi.object().keys({
    todo: Joi.string().required(),
  })
  const result = Joi.validate(data, Shape)
  return result
}

module.exports = inputTodoValidation
