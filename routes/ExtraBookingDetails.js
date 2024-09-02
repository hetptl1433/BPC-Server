const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createExtraBookingDetails, getExtraBookingDetails, listActiveCategories, removeExtraBookingDetailsMaster, updateExtraBookingDetailsMaster, listExtraBookingDetails, listActiveExtraBookingDetails, listExtraBookingDetailsByParams, getExtraBookingDetailsById  } = require("../controllers/ExtraBookingDetails/ExtraBookingDetails");

router.post("/auth/create/ExtraBookingDetails", catchAsync(createExtraBookingDetails));
router.get("/auth/list/ExtraBookingDetails", catchAsync(listExtraBookingDetails));

router.get(
  "/auth/list-active/ExtraBookingDetails",
  catchAsync(listActiveExtraBookingDetails)
);


router.post(
  "/auth/list-by-params/ExtraBookingDetails",
  catchAsync(listExtraBookingDetailsByParams)
);

router.get("/auth/get/ExtraBookingDetails/:_id", catchAsync(getExtraBookingDetails));

router.get(
  "/auth/get/book/ExtraBookingDetails/:_id",
  catchAsync(getExtraBookingDetailsById)
);

router.put(
  "/auth/update/ExtraBookingDetails/:_id",
  catchAsync(updateExtraBookingDetailsMaster)
);

router.delete(
  "/auth/remove/ExtraBookingDetails/:_id",
  catchAsync(removeExtraBookingDetailsMaster)
);


module.exports = router;