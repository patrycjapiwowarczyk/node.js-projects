const Joi = require("joi").extend(require("joi-phone-number"));

const contactsValidate = (contact) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().phoneNumber().required(),
    favorite: Joi.boolean(),
  });

  return schema.validate(contact);
};

module.exports = { contactsValidate };
