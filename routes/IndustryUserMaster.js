const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const {
  createIndustryUserMasterDetails,
  listIndustryUserMasterDetails,
  listIndustryUserMasterDetailsByParams,
  getIndustryUserMasterDetails,
  updateIndustryUserMasterDetails,
  removeIndustryUserMasterDetails,
  listIndustryUserMasterByCategory,
  loginUser,
} = require("../controllers/IndustryUserMaster/IndustryUserMaster");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/IndustryUserMaster");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/IndustryUserMaster-details",
  upload.single("myFile"),
  catchAsync(createIndustryUserMasterDetails)
);

router.get("/auth/list/IndustryUserMaster-details", catchAsync(listIndustryUserMasterDetails));

router.post(
  "/auth/list-by-params/IndustryUserMaster-details",
  catchAsync(listIndustryUserMasterDetailsByParams)
);

router.get("/auth/get/IndustryUserMaster-details/:_id", catchAsync(getIndustryUserMasterDetails));

router.put(
  "/auth/update/IndustryUserMaster-details/:_id",
  upload.single("myFile"),
  catchAsync(updateIndustryUserMasterDetails)
);

router.delete(
  "/auth/remove/IndustryUserMaster-details/:_id",
  catchAsync(removeIndustryUserMasterDetails)
);


// APPLICATION
router.get(
  "/auth/list/IndustryUserMaster-by-category/:categoryId",
  catchAsync(listIndustryUserMasterByCategory)
);

// router.post("/auth/list/IndustryUserMaster-by-id/:productId", catchAsync(getProductByID));

///


router.post("/ExamUserLogin", catchAsync(loginUser));

module.exports = router;
