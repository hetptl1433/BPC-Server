const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const RASSchema = new mongoose.Schema(
  {
    Organization: {
      type: String,
      required: true,
    },
    EmployeeCode: {
      type: Number,
    },
    Date: {
      type: String,
    },
    FullName: {
      type: String,
      required: true,
    },
    Designation: {
      type: String,
    },
    Department: {
      type: String,
    },
    Section: {
      type: String,
    },
    EmailID: {
      type: String,
      required: true,
    },
    MobileNo: {
      type: Number,
      required: true,
    },
    Reporting: {
      type: String,
    },
    DOB: {
      type: String,
      
    },
    DateofJoining: {
      type: String,
      
    },
    PreviousExperience: {
      type: String,
      
    },
    Educational: {
      type: String,
      
    },
    Achievement: {
      type: String,
      
    },
    Areaofinterest: {
      type: String,
      
    },
    Problem: {
      type: String,
      
    },
    Additionalresponsibility: {
      type: String,
      
    },

    Information: {
      type: String,
      
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RAS", RASSchema);
