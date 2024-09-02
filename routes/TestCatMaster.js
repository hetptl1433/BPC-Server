const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { createTestCatMasterDetails, listTestCatMasterDetails, listTestCatMasterDetailsByParams, getTestCatMasterDetails, updateTestCatMasterDetails, removeTestCatMasterDetails, listTestCatMasterByCategory, listTestCatMasterExamDetails, listTestCatMasterDetailsByCategory } = require("../controllers/TextCatMaster/TextCatMaster");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/TestCatMaster");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/TestCatMaster-details",
  upload.single("myFile"),
  catchAsync(createTestCatMasterDetails)
);

router.get(
  "/auth/list/TestCatMaster-details/:category",
  catchAsync(listTestCatMasterDetailsByCategory 

  )
);

router.get(
  "/auth/list/TestCatMaster-detailsByName",
  catchAsync(listTestCatMasterExamDetails)
);


router.post(
  "/auth/list-by-params/TestCatMaster-details",
  catchAsync(listTestCatMasterDetailsByParams)
);

router.get("/auth/get/TestCatMaster-details/:_id", catchAsync(getTestCatMasterDetails));

router.put(
  "/auth/update/TestCatMaster-details/:_id",
  upload.single("myFile"),
  catchAsync(updateTestCatMasterDetails)
);

router.delete(
  "/auth/remove/TestCatMaster-details/:_id",
  catchAsync(removeTestCatMasterDetails)
);


// APPLICATION
router.get(
  "/auth/list/TestCatMaster-by-category/:categoryId",
  catchAsync(listTestCatMasterByCategory)
);

// router.post("/auth/list/TestCatMaster-by-id/:productId", catchAsync(getProductByID));

///

module.exports = router;
