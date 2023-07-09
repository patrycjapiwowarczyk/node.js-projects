{
  const Joi = require("joi");

  const registrationValidate = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    return schema.validate(data);
  };

  const loginValidate = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    return schema.validate(data);
  };

  const emailValidate = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    return schema.validate(data);
  };

  module.exports = { registrationValidate, loginValidate, emailValidate };
}
