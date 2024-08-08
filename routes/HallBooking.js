const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { createHallBook, listHallBook, listHallBookByParams, getHallBook, updateHallBook, removeHallBook } = require("../controllers/HallBooking/HallBooking");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/HallBookImg");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/HallBook",
  upload.single("Icon"),
  catchAsync(createHallBook)
);

router.get("/auth/list/HallBook", catchAsync(listHallBook));

router.post(
  "/auth/list-by-params/HallBook",
  catchAsync(listHallBookByParams)
);

router.get("/auth/get/HallBook/:_id", catchAsync(getHallBook));

router.put(
  "/auth/update/HallBook/:_id",
  upload.single("Icon"),
  catchAsync(updateHallBook)
);

router.delete(
  "/auth/remove/HallBook/:_id",
  catchAsync(removeHallBook)
);

module.exports = router;
