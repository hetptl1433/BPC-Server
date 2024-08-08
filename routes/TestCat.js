const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");


const { createTestCategoryMaster, listTestCategoryMaster, listLEDActiveCategories, listTestCategoryMasterByParams, getTestCategoryMaster, updateTestCategoryMaster, removeTestCategoryMaster } = require("../controllers/TestCat/TestCat");

router.post(
  "/auth/create/TestCategoryMaster",
  catchAsync(createTestCategoryMaster)
);

router.get(
  "/auth/list/TestCategoryMaster",
  catchAsync(listTestCategoryMaster)
);

router.get(
  "/auth/list-active/TestCategoryMaster",
  catchAsync(listLEDActiveCategories)
);

router.post(
  "/auth/list-by-params/TestCategoryMaster",
  catchAsync(listTestCategoryMasterByParams)
);

router.get(
  "/auth/get/TestCategoryMaster/:_id",
  catchAsync(getTestCategoryMaster)
);

router.put(
  "/auth/update/TestCategoryMaster/:_id",
  catchAsync(updateTestCategoryMaster)
);

router.delete(
  "/auth/remove/TestCategoryMaster/:_id",
  catchAsync(removeTestCategoryMaster)
);

module.exports = router;
