const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createDownloadFiles,
  listDownloadFiles,
  listDownloadFilesByParams,
  getDownloadFiles,
  updateDownloadFiles,
  removeDownloadFiles,
} = require("../controllers/Download/Download");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/DownloadFile");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/DownloadFiles",
  upload.single("myFile"),
  catchAsync(createDownloadFiles)
);

router.get("/auth/list/DownloadFiles", catchAsync(listDownloadFiles));

router.post(
  "/auth/list-by-params/DownloadFiles",
  catchAsync(listDownloadFilesByParams)
);

router.get("/auth/get/DownloadFiles/:_id", catchAsync(getDownloadFiles));

router.put(
  "/auth/update/DownloadFiles/:_id",
  upload.single("myFile"),
  catchAsync(updateDownloadFiles)
);

router.delete(
  "/auth/remove/DownloadFiles/:_id",
  catchAsync(removeDownloadFiles)
);

module.exports = router;
