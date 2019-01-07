const Joi = require('joi')

const wordInputValidation = data => {
  const schema = Joi.object().keys({
    word: Joi.string().required(),
    description: Joi.string().required(),
    linkMap: Joi.string().required(),
    filePath: Joi.string().required(),
  })
  return Joi.validate(data, schema)
}

module.exports = wordInputValidation
