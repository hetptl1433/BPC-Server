const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const { excelResultData } = require("../controllers/ResultExcel/ResultExcel");
const { excelLegacyResultData} = require("../controllers/OldResultExcel/OldResultExcel");
const { getOldTestCategoryData, getOldIndustryData } = require("../controllers/OldResultData/OldResulData");
// const { excelLegacyResultData } = require("../controllers/OldResultData/OldResulData");


// Get RASData details by ID
router.post("/auth/get/ResultExcel", catchAsync(excelResultData));
router.get("/auth/get/LegacyTestCategory", catchAsync(getOldTestCategoryData));
router.get("/auth/get/LegacyTestIndustry", catchAsync(getOldIndustryData));


router.post("/auth/get/LegacyResultExcel", catchAsync(excelLegacyResultData));



module.exports = router;
