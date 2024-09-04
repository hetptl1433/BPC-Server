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
      ref: "TestCatMasters",
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
    },
    HinAnsA: {
      type: String,
    },
    GujAnsA: {
      type: String,
    },
    EngAnsB: {
      type: String,
    },
    HinAnsB: {
      type: String,
    },
    GujAnsB: {
      type: String,
    },
    EngAnsC: {
      type: String,
    },
    HinAnsC: {
      type: String,
    },
    GujAnsC: {
      type: String,
    },
    EngAnsD: {
      type: String,
    },
    HinAnsD: {
      type: String,
    },
    GujAnsD: {
      type: String,
    },
    EngAnsE: {
      type: String,
    },
    HinAnsE: {
      type: String,
    },
    GujAnsE: {
      type: String,
    },
    PointCatIDA: {
      type: Schema.Types.ObjectId,
      ref: "Points",
    },
    PointSelIDA: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
    },

    PointCatIDB: {
      type: Schema.Types.ObjectId,
      ref: "Points",
    },
    PointSelIDB: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
    },
    PointCatIDC: {
      type: Schema.Types.ObjectId,
      ref: "Points",
    },
    PointSelIDC: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
    },
    PointCatIDD: {
      type: Schema.Types.ObjectId,
      ref: "Points",
    },
    PointSelIDD: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
    },
    PointCatIDE: {
      type: Schema.Types.ObjectId,
      ref: "Points",
    },
    PointSelIDE: {
      type: Schema.Types.ObjectId,
      ref: "PointMaster",
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
