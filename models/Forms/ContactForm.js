const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ContactFormSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Mobile: {
      type: String,

      required: true,
    },
    Company: {
      type: String,

      required: true,
    },
    City: {
      type: String,

      required: true,
    },
    Services: {
      type: String,

      required: true,
    },
    Help: {
      type: String,

      required: true,
    },
    HereFrom: {
      type: String,

      required: true,
    },
    KnowMore: {
      type: Boolean,
    },

    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactForm", ContactFormSchema);
