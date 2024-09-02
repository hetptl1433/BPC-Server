const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const BookingDetails = new mongoose.Schema(
  {
    HallName: {
      type: String,
      required: true,
    },
    BookTime: {
      type: String,
      required: true,
    },
    BookDate: {
      type: Date,
      required: true,
    },
    CompanyName: {
      type: String,
      required: true,
    },
    ContactPerson: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Mobile: {
      type: String,
      required: true,
    },
    Total: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookingDetails", BookingDetails);
