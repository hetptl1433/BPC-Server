const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const HallBookSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Desc: {
      type: String,
      required: true,
    },
    HalfDayCapacity: {
      type: String,

      required: true,
    },
    HalfDayBasicValue: {
      type: String,

      required: true,
    },
    HalfDayCentralGST: {
      type: String,

      required: true,
    },
    HalfDayStateGST: {
      type: String,

      required: true,
    },
    HalfDayTotal: {
      type: String,

      required: true,
    },
    FullDayCapacity: {
      type: String,

      required: true,
    },
    FullDayBasicValue: {
      type: String,

      required: true,
    },
    FullDayCentralGST: {
      type: String,

      required: true,
    },
    FullDayStateGST: {
      type: String,

      required: true,
    },
    FullDayTotal: {
      type: String,

      required: true,
    },
    SortOrder: {
      type: Number,

      required: true,
    },
  Icon: {
      type: String,
      required: true
    },
    
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HallBooking", HallBookSchema);
