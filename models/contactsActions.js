const contactsTasks = require("../models/contactsTasks");

const contactsActions = {
  getContacts: async (req, res, next) => {
    try {
      const contacts = await contactsTasks.getContacts(req.user._id);
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  },

  getContactById: async (req, res, next) => {
    try {
      const contact = await contactsTasks.getContactById(req.params.id, req.user._id);
      if (!contact) {
        return res.status(404).json({ message: `Contact with id ${req.params.id} doesn't exist` });
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },

  getFavoriteContacts: async (req, res, next) => {
    try {
      const owner = req.user._id;
      const contacts = await contactsTasks.getFavoriteContacts(owner);
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  },

  addContact: async (req, res, next) => {
    try {
      const newContact = await contactsTasks.addContact(req.body, req.user._id);
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  },

  removeContact: async (req, res, next) => {
    try {
      const contact = await contactsTasks.removeContact(req.params.id, req.user._id);
      if (!contact) {
        return res.status(404).json({ message: `Contact with id ${req.params.id} doesn't exist` });
      }
      res.json({ message: "Contact deleted" });
    } catch (error) {
      next(error);
    }
  },

  updateContact: async (req, res, next) => {
    try {
      const updatedContact = await contactsTasks.updateContact(req.params.id, req.body, req.user._id);
      if (!updatedContact) {
        return res.status(404).json({ message: `Contact with id ${req.params.id} doesn't exist` });
      }
      res.json(updatedContact);
    } catch (error) {
      next(error);
    }
  },

  toggleFavourite: async (req, res, next) => {
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "Missing favourite checkbox" });
    }
    try {
      const updatedContact = await contactsTasks.toggleFavourite(req.params.id, favorite, req.user._id);
      if (!updatedContact) {
        return res.status(404).json({ message: `Contact with id ${req.params.id} doesn't exist` });
      }
      res.json(updatedContact);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = contactsActions;
