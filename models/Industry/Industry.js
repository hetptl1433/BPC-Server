const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const IndustrySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      require: true,
    },
    Email: {
      type: String,
      require: true,
    },
    Address: {
      type: String,
      require: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Industry", IndustrySchema);
