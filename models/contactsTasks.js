const ContactSchema = require("./contactsSchema");
const { contactsValidate } = require("./contactsValidate");

const contactsTasks = {
  getContacts: (owner) => {
    return ContactSchema.find({ owner });
  },

  getContactById: (id, owner) => {
    return ContactSchema.find({ _id: id, owner });
  },

  getFavoriteContacts: (owner) => {
    return Contact.find({ owner, favorite: true });
  },

  addContact: (contactBody, owner) => {
    const { error } = contactsValidate(contactBody);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const newContact = { ...contactBody, owner };
    return ContactSchema.create(newContact);
  },

  removeContact: (id, owner) => {
    return ContactSchema.findByIdAndRemove({ _id: id, owner });
  },

  updateContact: (id, contactBody, owner) => {
    const { error } = contactsValidate(contactBody);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { name, email, phone } = contactBody;
    return ContactSchema.findByIdAndUpdate({ _id: id, owner }, { name, email, phone }, { new: true });
  },

  toggleFavourite: (contactId, favorite, owner) => {
    return ContactSchema.findByIdAndUpdate({ _id: id, owner }, { $set: { favorite } }, { new: true });
  },
};

module.exports = contactsTasks;
