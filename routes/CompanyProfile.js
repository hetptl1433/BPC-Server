const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { createCompanyProfileDetails, listCompanyProfileDetails, listCompanyProfileDetailsByParams, getCompanyProfileDetails, updateCompanyProfileDetails, removeCompanyProfileDetails, listCompanyProfileByCategory } = require("../controllers/CompanyProfile/CompanyProfile");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/CompanyProfile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/CompanyProfile-details",
  upload.single("productImage"), // Ensure this matches the field name in the front-end
  catchAsync(createCompanyProfileDetails)
);
router.get("/auth/list/CompanyProfile-details", catchAsync(listCompanyProfileDetails));

router.post(
  "/auth/list-by-params/CompanyProfile-details",
  catchAsync(listCompanyProfileDetailsByParams)
);

router.get("/auth/get/CompanyProfile-details/:_id", catchAsync(getCompanyProfileDetails));

router.put(
  "/auth/update/CompanyProfile-details/:_id",
  upload.single("myFile"),
  catchAsync(updateCompanyProfileDetails)
);

router.delete(
  "/auth/remove/CompanyProfile-details/:_id",
  catchAsync(removeCompanyProfileDetails)
);


// APPLICATION
router.get(
  "/auth/list/CompanyProfile-by-category/:categoryId",
  catchAsync(listCompanyProfileByCategory)
);

// router.post("/auth/list/CompanyProfile-by-id/:productId", catchAsync(getProductByID));

///

module.exports = router;
