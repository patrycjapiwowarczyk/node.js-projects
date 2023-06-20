const ContactSchema = require("./contactsSchema");
const { contactsValidate } = require("./contactsValidate");

const contactsTasks = {
  getContacts: () => {
    return ContactSchema.find();
  },

  getContactById: (id) => {
    return ContactSchema.find(id);
  },

  addContact: (contactBody) => {
    const { error } = contactsValidate(contactBody);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return ContactSchema.create(contactBody);
  },

  removeContact: (id) => {
    return ContactSchema.findByIdAndRemove(id);
  },

  updateContact: (id, contactBody) => {
    const { error } = contactsValidate(contactBody);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { name, email, phone } = contactBody;
    return ContactSchema.findByIdAndUpdate(id, { name, email, phone }, { new: true });
  },

  toggleFavourite: (contactId, favorite) => {
    return ContactSchema.findByIdAndUpdate(contactId, { $set: { favorite } }, { new: true });
  },
};

module.exports = contactsTasks;
