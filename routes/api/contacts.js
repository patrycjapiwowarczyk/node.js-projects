const express = require("express");
const mongoose = require("mongoose");
const ContactSchema = require("../../models/contactsSchema");
const { contactsValidate } = require("../../models/contactsValidate");

const router = express.Router();

const validate = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
};

const getContacts = async (req, res, next) => {
  try {
    const contacts = await ContactSchema.find();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await ContactSchema.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: `Contacts with id ${req.params.id} doesn't exist` });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { error } = contactsValidate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newContact = await ContactSchema.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await ContactSchema.findByIdAndRemove(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: `Contacts with id ${req.params.id} doesn't exist` });
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = contactsValidate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, phone } = req.body;
    const updatedContact = await ContactSchema.findByIdAndUpdate(req.params.id, { name, email, phone }, { new: true });
    if (!updatedContact) {
      res.status(404).json({ message: `Contacts with id ${req.params.id} doesn't exist` });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateFavourite = async (req, res, next) => {
  const { favorite } = req.body;
  if (favorite === undefined) {
    return res.status(400).json({ message: "Missing favourite checkbox" });
  }
  try {
    const updatedFavouriteContact = await ContactSchema.findByIdAndUpdate(req.params.contactId, { $set: { favorite } }, { new: true });
    if (!updatedFavouriteContact) {
      res.status(404).json({ message: `Contacts with id ${req.params.id} doesn't exist` });
    }
    res.json(updatedFavouriteContact);
  } catch (error) {
    next(error);
  }
};

router.get("/", getContacts);

router.get("/:id", validate, getContactById);

router.post("/", createContact);

router.delete("/:id", validate, deleteContact);

router.put("/:id", validate, updateContact);

router.patch("/:contactId/favorite", updateFavourite);

module.exports = router;
