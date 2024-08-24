const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const {
  createEmailTempleteDetails,
  listEmailTempleteDetails,
  listEmailTempleteDetailsByParams,
  getEmailTempleteDetails,
  updateEmailTempleteDetails,
  removeEmailTempleteDetails,
  listEmailTempleteByCategory,
} = require("../controllers/EmailTemplete/EmailTemplete");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/EmailTemplete");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/EmailTemplete-details",
  upload.single("myFile"),
  catchAsync(createEmailTempleteDetails)
);

router.get("/auth/list/EmailTemplete-details", catchAsync(listEmailTempleteDetails));

router.post(
  "/auth/list-by-params/EmailTemplete-details",
  catchAsync(listEmailTempleteDetailsByParams)
);

router.get("/auth/get/EmailTemplete-details/:_id", catchAsync(getEmailTempleteDetails));

router.put(
  "/auth/update/EmailTemplete-details/:_id",
  upload.single("myFile"),
  catchAsync(updateEmailTempleteDetails)
);

router.delete(
  "/auth/remove/EmailTemplete-details/:_id",
  catchAsync(removeEmailTempleteDetails)
);

// APPLICATION
router.get(
  "/auth/list/EmailTemplete-by-category/:categoryId",
  catchAsync(listEmailTempleteByCategory)
);

// router.post("/auth/list/EmailTemplete-by-id/:productId", catchAsync(getProductByID));

///

module.exports = router;
