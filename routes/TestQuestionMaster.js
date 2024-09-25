const express = require("express");
const fs = require("fs");
const multer = require("multer");



const router = express.Router();

const {
 

  listTestQuestionMaster,
  removeTestQuestionMaster,
  listTestQuestionMasterByParams,
  createTestQuestionMaster,
  getTestQuestionMaster,
  updateTestQuestionMaster,
  getTestQuestionMasterId,

 
} = require("../controllers/TestQuestionMaster/TestQuestionMaster");

const catchAsync = require("../utils/catchAsync");


//location setup ---> TestQuestionMaster
router.post ("/auth/location/TestQuestionMaster", catchAsync(listTestQuestionMaster));
router.post(
  "/auth/location/TestQuestionParam",
  catchAsync(listTestQuestionMasterByParams)
);
router.delete("/auth/location/TestQuestionMaster/:_id", catchAsync(removeTestQuestionMaster));
router.get("/auth/location/TestQuestionMaster/:_id", catchAsync(getTestQuestionMaster));

router.get(
  "/auth/location/TestQuestionMasterId/:_id",
  catchAsync(getTestQuestionMasterId)
);

router.post(
  "/auth/location/create/TestQuestionMaster",
  catchAsync(createTestQuestionMaster)
);
router.put("/auth/location/TestQuestionMaster/:_id", catchAsync(updateTestQuestionMaster));



const multerStorageCK = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/TestQuestionMaster");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const uploadCk = multer({ storage: multerStorageCK });

//upload images
router.post(
  "/auth/TestQuestionMaster/image-upload",
  uploadCk.single("uploadImg"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);

module.exports = router;
