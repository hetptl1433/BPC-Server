const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { createImages, listImgages, listImagesByParams, getImages, updateImages, removeImages } = require("../controllers/Gallery/Gallery");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/GalleryImg");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/GalleryImg",
  upload.single("myFile"),
  catchAsync(createImages)
);

router.get("/auth/list/GalleryImg", catchAsync(listImgages));

router.post(
  "/auth/list-by-params/GalleryImg",
  catchAsync(listImagesByParams)
);

router.get("/auth/get/GalleryImg/:_id", catchAsync(getImages));

router.put(
  "/auth/update/GalleryImg/:_id",
  upload.single("myFile"),
  catchAsync(updateImages)
);

router.delete(
  "/auth/remove/GalleryImg/:_id",
  catchAsync(removeImages)
);

module.exports = router;
