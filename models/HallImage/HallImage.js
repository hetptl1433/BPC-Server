
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const HalleBoardSchema = new mongoose.Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "HalleCategory",
      required: true,
    },
    SortOrder: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    
    IsActive: {
      type: Boolean,
      default: false,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("HalleBoard", HalleBoardSchema);
