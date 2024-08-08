const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");


const { createHalleCategoryMaster, listHalleCategoryMaster, listHalleActiveCategories, listHalleCategoryMasterByParams, getHalleCategoryMaster, updateHalleCategoryMaster, removeHalleCategoryMaster } = require("../controllers/Category/HallImage");

router.post(
  "/auth/create/HalleCategoryMaster",
  catchAsync(createHalleCategoryMaster)
);

router.get(
  "/auth/list/HalleCategoryMaster",
  catchAsync(listHalleCategoryMaster)
);

router.get(
  "/auth/list-active/HalleCategoryMaster",
  catchAsync(listHalleActiveCategories)
);

router.post(
  "/auth/list-by-params/HalleCategoryMaster",
  catchAsync(listHalleCategoryMasterByParams)
);

router.get(
  "/auth/get/HalleCategoryMaster/:_id",
  catchAsync(getHalleCategoryMaster)
);

router.put(
  "/auth/update/HalleCategoryMaster/:_id",
  catchAsync(updateHalleCategoryMaster)
);

router.delete(
  "/auth/remove/HalleCategoryMaster/:_id",
  catchAsync(removeHalleCategoryMaster)
);

module.exports = router;
