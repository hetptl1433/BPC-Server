const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { createEmailFormDetails, listEmailFormDetails, listEmailFormDetailsByParams, getEmailFormDetails, updateEmailFormDetails, removeEmailFormDetails, listEmailFormByCategory } = require("../controllers/EmailForm/EmailForm");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/EmailForm");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/EmailForm-details",
  upload.single("myFile"),
  catchAsync(createEmailFormDetails)
);

router.get("/auth/list/EmailForm-details", catchAsync(listEmailFormDetails));

router.post(
  "/auth/list-by-params/EmailForm-details",
  catchAsync(listEmailFormDetailsByParams)
);

router.get("/auth/get/EmailForm-details/:_id", catchAsync(getEmailFormDetails));

router.put(
  "/auth/update/EmailForm-details/:_id",
  upload.single("myFile"),
  catchAsync(updateEmailFormDetails)
);

router.delete(
  "/auth/remove/EmailForm-details/:_id",
  catchAsync(removeEmailFormDetails)
);


// APPLICATION
router.get(
  "/auth/list/EmailForm-by-category/:categoryId",
  catchAsync(listEmailFormByCategory)
);

// router.post("/auth/list/EmailForm-by-id/:productId", catchAsync(getProductByID));

///

module.exports = router;
