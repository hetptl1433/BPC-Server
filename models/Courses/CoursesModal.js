const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CourseSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Duration: {
      type: String,

      required: true,
    },
    Timing: {
      type: String,
      required: true,
    },
    Eligibility: {
      type: String,
      required: true,
    },
    Fees: {
      type: String,
      required: true,
    },
    SortOrder: {
      type: Number,
      required: true,
    },
    Desc: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
