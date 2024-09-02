const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createBookingDetails, getBookingDetails, listActiveCategories, removeBookingDetailsMaster, updateBookingDetailsMaster, listBookingDetails, listActiveBookingDetails, listBookingDetailsByParams  } = require("../controllers/BookingDetails/BookingDetails");

router.post("/auth/create/BookingDetails", catchAsync(createBookingDetails));
router.get("/auth/list/BookingDetails", catchAsync(listBookingDetails));

router.get(
  "/auth/list-active/BookingDetails",
  catchAsync(listActiveBookingDetails)
);

router.post(
  "/auth/list-by-params/BookingDetails",
  catchAsync(listBookingDetailsByParams)
);

router.get("/auth/get/BookingDetails/:_id", catchAsync(getBookingDetails));

router.put(
  "/auth/update/BookingDetails/:_id",
  catchAsync(updateBookingDetailsMaster)
);

router.delete(
  "/auth/remove/BookingDetails/:_id",
  catchAsync(removeBookingDetailsMaster)
);


module.exports = router;