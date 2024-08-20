const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const DownloadFilesSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },

    DownloadFile: {
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

module.exports = mongoose.model("Download", DownloadFilesSchema);
