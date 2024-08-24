
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const EmailFormSchema = new mongoose.Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "emailmasters",
      required: true,
    },
    FormName: {
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

module.exports = mongoose.model("EmailForm", EmailFormSchema);
