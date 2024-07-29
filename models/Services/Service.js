const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const Service = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortdesc:{
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    image:{
      type: String,
      required: true,
    },
    sortOrder:{
      type: Number,
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("serviceImg", Service);
