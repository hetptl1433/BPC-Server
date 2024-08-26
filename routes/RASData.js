const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  createRASDataDetails,
  getRASDataDetails,
  listRASDataDetails,
  listRASDataByParams,
  updateRASDataDetails,
  removeRASDataDetails,
} = require("../controllers/RASData/RASData");

// Create new RASData
router.post("/auth/RASData", catchAsync(createRASDataDetails));

// Get RASData details by ID
router.get("/auth/get/RASData/:_id", catchAsync(getRASDataDetails));

// List all RASData
router.get("/auth/list/RASData", catchAsync(listRASDataDetails));

// List RASData by parameters
router.post("/auth/list-by-params/RASData", catchAsync(listRASDataByParams));

// Update RASData by ID
router.put("/auth/update/RASData/:_id", catchAsync(updateRASDataDetails));

// Remove RASData by ID
router.delete("/auth/remove/RASData/:_id", catchAsync(removeRASDataDetails));

module.exports = router;
