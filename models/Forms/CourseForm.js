const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CourseFormSchema = new mongoose.Schema(
  {
    CourseName: { type: String, required: true },
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
  

    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseForm", CourseFormSchema);
