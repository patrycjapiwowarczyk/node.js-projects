const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Set phone number for contact"],
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
      required: [true, "Set is favorite for a contact"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { collection: "contacts", versionKey: false }
);

module.exports = mongoose.model("ContactSchema", contactSchema);
