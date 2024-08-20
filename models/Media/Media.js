const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const MediaFilesSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
   
    MediaFile: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaFilesSchema);
