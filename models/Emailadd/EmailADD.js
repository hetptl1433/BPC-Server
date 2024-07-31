const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const EmailSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Email: {
        type: String,
  
        required: true,
      },
    
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

  module.exports = mongoose.model("Email", EmailSchema);
