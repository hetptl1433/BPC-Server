const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ExtraBookingDetails = new mongoose.Schema(
  {
    OrderId: {
      type: Schema.Types.ObjectId,
      ref: "bookingdetails",
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    Quantity: {
      type: String,
      required: true,
    },
    SortOrder: {
      type: String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExtraBookingDetails", ExtraBookingDetails);
