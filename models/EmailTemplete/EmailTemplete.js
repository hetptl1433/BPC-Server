const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const EmailTempleteSchema = new mongoose.Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "emailmasters",
      required: true,
    },
    FormTitle: {
      type: String,
      required: true,
    },
    FormDesc: {
      type: String,
      required: true,
    },

    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailTemplete", EmailTempleteSchema);
