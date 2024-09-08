const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const { excelResultData } = require("../controllers/ResultExcel/ResultExcel");


// Get RASData details by ID
router.post("/auth/get/ResultExcel", catchAsync(excelResultData));

module.exports = router;
