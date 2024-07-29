const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      
    },
    sortOrder:{
      type: Number,
      required: true,
      default: 0
    },
    image: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
