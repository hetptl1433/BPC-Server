const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ExtraBookingSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Price: {
      type: Number,
    },
    SortOrder: {
      type: Number,
    },
    IsActive: {
      type: Boolean,
    },
   
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExtraBookingSchema", ExtraBookingSchema);
