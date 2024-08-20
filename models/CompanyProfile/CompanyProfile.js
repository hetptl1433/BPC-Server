
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CompanyProfileSchema = new mongoose.Schema(
  {
    CompanyName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    SalesEmail: {
      type: String,
      required: true,
    },
    SupportEmail: {
      type: String,
      required: true,
    },
    PartnerEmail: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    PhoneOff1: {
      type: String,
      required: true,
    },
    PhoneOff2: {
      type: String,
      required: true,
    },
    MobileOne1: {
      type: String,
      required: true,
    },
    MobileOne2: {
      type: String,
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

module.exports = mongoose.model("CompanyProfile", CompanyProfileSchema);
