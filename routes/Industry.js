const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const { createIndustry, listIndustry, listActiveIndustry, listIndustryByParams, getIndustry, updateIndustry, removeIndustry } = require("../controllers/Industry/Industry");

router.post("/auth/Industry", catchAsync(createIndustry));
router.get("/auth/list/Industry", catchAsync(listIndustry));

router.get(
  "/auth/list-active/Industry",
  catchAsync(listActiveIndustry)
);

router.post(
  "/auth/list-by-params/Industry",
  catchAsync(listIndustryByParams)
);

router.get("/auth/get/Industry/:_id", catchAsync(getIndustry));

router.put(
  "/auth/update/Industry/:_id",
  catchAsync(updateIndustry)
);

router.delete(
  "/auth/remove/Industry/:_id",
  catchAsync(removeIndustry)
);


module.exports = router;