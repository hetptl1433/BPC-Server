const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const RASDataSchema = new mongoose.Schema(
  {

    EmailID:{
      type: String,
      ref: "RAS",
      required: true,
    },
    Name:{
      type:String,
      required:true
    },
    Frequency:{
      type: String,
      required:true
    },
    TimeperFrequency:{
      type: String,
      required:true

    },
    Remarks:{
      type:String,
      required:true
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RASData", RASDataSchema);
