const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ContentContactSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      require: true,
    },
    Email: {
      type: String,
      require: true,
    },
    Designation: {
      type: String,
      require: true,
    },
    SortOrder:{
      type:Number,
      default:0,
      
      },
    
    IsActive: {
      type: Boolean,
    },
   
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContentContactN", ContentContactSchema);
