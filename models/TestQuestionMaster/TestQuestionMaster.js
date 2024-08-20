const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const TestQuestionMasterSchema = new mongoose.Schema(
  {
    TestCategoryID: {
      type: Schema.Types.ObjectId,
      ref: "TestCat",
      required: true,
    },

    TestMasterID: {
      type: Schema.Types.ObjectId,
      ref: "TestCatMaster",
      required: true,
    },

    QuesType: {
      type: String,
      required: true,
    },
    AnsType: {
      type: String,
      required: true,
    },
    EngQues: {
      type: String,
      required: true,
    },
    HinQues: {
      type: String,
      required: true,
    },
    GujQues: {
      type: String,
      required: true,
    },
    EngAnsA: {
      type: String,
      required: true,
    },
    HinAnsA: {
      type: String,
      required: true,
    },
    GujAnsA: {
      type: String,
      required: true,
    },
    EngAnsB: {
      type: String,
      required: true,
    },
    HinAnsB: {
      type: String,
      required: true,
    },
    GujAnsB: {
      type: String,
      required: true,
    },
    EngAnsC: {
      type: String,
      required: true,
    },
    HinAnsC: {
      type: String,
      required: true,
    },
    GujAnsC: {
      type: String,
      required: true,
    },
    EngAnsD: {
      type: String,
      required: true,
    },
    HinAnsD: {
      type: String,
      required: true,
    },
    GujAnsD: {
      type: String,
      required: true,
    },
    EngAnsE: {
      type: String,
      required: true,
    },
    HinAnsE: {
      type: String,
      required: true,
    },
    GujAnsE: {
      type: String,
      required: true,
    },
    PointCatIDA: {
      type: Schema.Types.ObjectId,
      ref: "Points",
      required: true,
    },
    PointSelIDA: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
      required: true,
    },

    PointCatIDB: {
      type: Schema.Types.ObjectId,
      ref: "Points",
      required: true,
    },
    PointSelIDB: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
      required: true,
    },
    PointCatIDC: {
      type: Schema.Types.ObjectId,
      ref: "Points",
      required: true,
    },
    PointSelIDC: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
      required: true,
    },
    PointCatIDD: {
      type: Schema.Types.ObjectId,
      ref: "Points",
      required: true,
    },
    PointSelIDD: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
      required: true,
    },
    PointCatIDE: {
      type: Schema.Types.ObjectId,
      ref: "Points",
      required: true,
    },
    PointSelIDE: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
      required: true,
    },

    SortOrder: {
      type: Number,
      default: 0,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestQuestionMaster", TestQuestionMasterSchema);
