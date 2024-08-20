//category name
//is active


const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UserGroupMasterSchema = new mongoose.Schema(
  {
    categoryName: {
        type: String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserGroupMaster", UserGroupMasterSchema);
