
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const IndustryUserMasterSchema = new mongoose.Schema(
  {
    UserGroupCategory: {
      type: Schema.Types.ObjectId,
      ref: "UserGroupMaster",
      required: true,
    },
    IndustryCategory: {
      type: Schema.Types.ObjectId,
      ref: "Industries",
      required: true, 
    },

    Name: {
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
    landLine: {
      type: String,
      required: true,
    },
    UserName:{
      type:String,
      required:true,
    },
    Password:{
      type:String,
      required:true,
    },
    Address:{
      type:String,
      required: true,
      },

    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IndustryUserMaster", IndustryUserMasterSchema);
