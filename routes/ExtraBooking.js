const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createExtraBooking, listExtraBooking, listActiveExtraBooking, listExtraBookingByParams, getExtraBooking, updateExtraBooking, removeExtraBooking } = require("../controllers/ExtraBooking/ExtraBooking");

router.post("/auth/ExtraBooking", catchAsync(createExtraBooking));
router.get("/auth/list/ExtraBooking", catchAsync(listExtraBooking));

router.get(
  "/auth/list-active/ExtraBooking",
  catchAsync(listActiveExtraBooking)
);

router.post(
  "/auth/list-by-params/ExtraBooking",
  catchAsync(listExtraBookingByParams)
);

router.get("/auth/get/ExtraBooking/:_id", catchAsync(getExtraBooking));

router.put(
  "/auth/update/ExtraBooking/:_id",
  catchAsync(updateExtraBooking)
);

router.delete(
  "/auth/remove/ExtraBooking/:_id",
  catchAsync(removeExtraBooking)
);


module.exports = router;