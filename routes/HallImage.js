const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { createHalleBoardDetails, listHalleBoardDetails, listHalleBoardDetailsByParams, getHalleBoardDetails, updateHalleBoardDetails, removeHalleBoardDetails, listHalleBoardByCategory } = require("../controllers/HallImage/HallImage");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/HalleBoard");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/Halleboard-details",
  upload.single("myFile"),
  catchAsync(createHalleBoardDetails)
);

router.get("/auth/list/Halleboard-details", catchAsync(listHalleBoardDetails));

router.post(
  "/auth/list-by-params/Halleboard-details",
  catchAsync(listHalleBoardDetailsByParams)
);

router.get("/auth/get/Halleboard-details/:_id", catchAsync(getHalleBoardDetails));

router.put(
  "/auth/update/Halleboard-details/:_id",
  upload.single("myFile"),
  catchAsync(updateHalleBoardDetails)
);

router.delete(
  "/auth/remove/Halleboard-details/:_id",
  catchAsync(removeHalleBoardDetails)
);


// APPLICATION
router.get(
  "/auth/list/Halleboard-by-category/:categoryId",
  catchAsync(listHalleBoardByCategory)
);

// router.post("/auth/list/Halleboard-by-id/:productId", catchAsync(getProductByID));

///

module.exports = router;
