const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const PointMasterSchema = new mongoose.Schema(
  {
    PointMasterName: {
      type: String,
      required: true,
    },
    PointMasterTitle: {
      type: String,
      required: true,
    },
    PointMasterPoints: {
      type: String,
      required: true,
    },
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
    PointID: {
      type: Schema.Types.ObjectId,
      ref: "Points",
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

module.exports = mongoose.model("PointMaster", PointMasterSchema);
