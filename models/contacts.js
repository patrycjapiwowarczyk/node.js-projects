const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const { v4: uuidv4 } = require("uuid");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error(`Error reading file ${contactsPath}`);
  }
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((ctc) => ctc.id === contactId);
  if (!contact) {
    console.error(`Contact with id ${contactId} doesn't exist`);
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((ctc) => ctc.id === contactId);
  if (index === -1) {
    console.error(`Contact with id ${contactId} doesn't exist`);
  }
  const [contact] = contacts.splice(index, 1);
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (error) {
    console.error(`Error deleting contact with id ${contactId}`);
    throw new Error(`Error deleting contact`);
  }
  return contact;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: uuidv4(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((ctc) => ctc.id === contactId);
  if (index === -1) {
    console.error(`Contact with id ${contactId} doesn't exist`);
  }
  const updatedContact = { ...contacts[index], ...body, id: contactId };
  contacts.splice(index, 1, updatedContact);
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (error) {
    console.error(`Error updating contact with id ${contactId}`);
    throw new Error(`Error updating contact`);
  }
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
