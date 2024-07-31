const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createLocationNum, getLocationNum, listActiveCategories, removeLocationNumMaster, updateLocationNumMaster, listLocationNum, listActiveLocationNum, listLocationNumByParams  } = require("../controllers/LocationNum/LocationNum");

router.post("/auth/LocationNum", catchAsync(createLocationNum));
router.get("/auth/list/LocationNum", catchAsync(listLocationNum));

router.get(
  "/auth/list-active/LocationNum",
  catchAsync(listActiveLocationNum)
);

router.post(
  "/auth/list-by-params/LocationNum",
  catchAsync(listLocationNumByParams)
);

router.get("/auth/get/LocationNum/:_id", catchAsync(getLocationNum));

router.put(
  "/auth/update/LocationNum/:_id",
  catchAsync(updateLocationNumMaster)
);

router.delete(
  "/auth/remove/LocationNum/:_id",
  catchAsync(removeLocationNumMaster)
);


module.exports = router;