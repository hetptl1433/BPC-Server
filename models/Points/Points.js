//category name
//is active


const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const PointsSchema = new mongoose.Schema(
  {
    PointName: {
        type: String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Points", PointsSchema);
