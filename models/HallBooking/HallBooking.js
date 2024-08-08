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
      type: Number,

      required: true,
    },
    HalfDayBasicValue: {
      type: Number,

      required: true,
    },
    HalfDayCentralGST: {
      type: Number,

      required: true,
    },
    HalfDayStateGST: {
      type: Number,

      required: true,
    },
    HalfDayTotal: {
      type: Number,

      required: true,
    },
    FullDayCapacity: {
      type: Number,

      required: true,
    },
    FullDayBasicValue: {
      type: Number,

      required: true,
    },
    FullDayCentralGST: {
      type: Number,

      required: true,
    },
    FullDayStateGST: {
      type: Number,

      required: true,
    },
    FullDayTotal: {
      type: Number,

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
