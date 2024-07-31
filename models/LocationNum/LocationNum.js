const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const LocationNum = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Code: {
      type: String,
    },
    ShortName: {
      type: String,
    },
   
    IsActive: {
      type: Boolean,
    },
   
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", LocationNum);
