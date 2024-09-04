
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ResultDataSchema = new mongoose.Schema(
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
   TotalTime:{
    type:String,
    required:true

   },
   ExamDate:{
    type:String,
    required:true
   },
    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResultData", ResultDataSchema);
