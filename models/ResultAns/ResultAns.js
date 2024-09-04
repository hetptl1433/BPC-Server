
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ResultAnsSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "IndustryUserMaster",
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      ref: "TestCatMaster",
      required: true,
    },
    pointMasterId: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
      required: true,
    },
    Language: {
      type: String,
      required: true,
    },

    questionNumber: {
      type: Number,
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "TestQuestionMaster",
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResultAns", ResultAnsSchema);
