const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createMediaFiles,
  listMediaFiles,
  listMediaFilesByParams,
  getMediaFiles,
  updateMediaFiles,
  removeMediaFiles,
} = require("../controllers/Media/Media");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/MediaFile");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/MediaFiles",
  upload.single("myFile"),
  catchAsync(createMediaFiles)
);

router.get("/auth/list/MediaFiles", catchAsync(listMediaFiles));

router.post(
  "/auth/list-by-params/MediaFiles",
  catchAsync(listMediaFilesByParams)
);

router.get("/auth/get/MediaFiles/:_id", catchAsync(getMediaFiles));

router.put(
  "/auth/update/MediaFiles/:_id",
  upload.single("myFile"),
  catchAsync(updateMediaFiles)
);

router.delete(
  "/auth/remove/MediaFiles/:_id",
  catchAsync(removeMediaFiles)
);

module.exports = router;
