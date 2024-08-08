
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const TestCatMasterSchema = new mongoose.Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "TestCat",
      required: true,
    },
    TestName: {
      type: String,
      required: true,
    },
    TotalQues: {
      type: String,
      required: true,
    },
    TotalTime: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    IsHabit: {
      type: Boolean,
      default: false,
    },
    Desc: {
      type: String,
      required: true,
    },
    HindiDesc: {
      type: String,
      required: true,
    },
    GujDesc: {
      type: String,
      required: true,
    },
    EngDesc: {
      type: String,
      required: true,
    },

    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestCatMaster", TestCatMasterSchema);
