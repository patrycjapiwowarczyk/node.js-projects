const express = require("express");
const { listContacts, getContactById, removeContact, addContact, updateContact } = require("../../models/contacts");
const Joi = require("joi").extend(require("joi-phone-number"));

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().phoneNumber().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.json(contacts);
    } else {
      res.status(404).json({ message: "Contacts not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId);
    if (contact !== undefined) {
      res.json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contacts not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, phone } = req.body;
    const updatedContact = await updateContact(req.params.contactId, {
      name,
      email,
      phone,
    });
    if (updateContact) {
      res.json(updateContact);
    } else {
      res.status(404).json({ message: "Error updating" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
