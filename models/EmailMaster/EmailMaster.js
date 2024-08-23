const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const EmailSchema = new mongoose.Schema(
  {
    MailerName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,

      required: true,
    },
    Password: {
      type: String,

      required: true,
    },
    OutgoingServer: {
      type: String,
      required: true,
    },
    outgoingPort: {
      type: String,
      required: true,
    },
    SSLType: {
      type: Boolean,
    },

    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

  module.exports = mongoose.model("Email", EmailSchema);
