const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ServeFilesSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },

    ServeFile: {
      type: String,
      required: true,
    },
    SortOrder: {
      type: Number,
      required: true,
      default: 0,
    },

    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Serve", ServeFilesSchema);
