const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createBannerImages,
  listBannerImages,
  listBannerImagesByParams,
  getBannerImages,
  updateBannerImages,
  listActiveBannerImages,
  removeBannerImages,
} = require("../controllers/BannerImage/BannerImages");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/BannerImage");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/banner-images1",
  upload.single("myFile"),
  catchAsync(createBannerImages)
);

router.get("/auth/list/banner-images1", catchAsync(listBannerImages));

router.get(
  "/auth/list-active/banner-images1",
  catchAsync(listActiveBannerImages)
);


router.post(
  "/auth/list-by-params/banner-images1",
  catchAsync(listBannerImagesByParams)
);

router.get("/auth/get/banner-images1/:_id", catchAsync(getBannerImages));

router.put(
  "/auth/update/banner-images1/:_id",
  upload.single("myFile"),
  catchAsync(updateBannerImages)
);

router.delete(
  "/auth/remove/banner-images1/:_id",
  catchAsync(removeBannerImages)
);

module.exports = router;
