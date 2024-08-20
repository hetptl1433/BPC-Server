const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const AreaSchema = new mongoose.Schema(
  {
    AreaName: {
      type: String,
      required: true,
    },
    CityID: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    StateID: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    CountryID: {
      type: Schema.Types.ObjectId,
      ref: "Country",
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

module.exports = mongoose.model("Area", AreaSchema);
