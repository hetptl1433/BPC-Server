const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ContentSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    subTitle: {
        type: String,
  
        required: true,
      },
    Desc: {
      type: String,
      required: true,
    },
  
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", ContentSchema);
