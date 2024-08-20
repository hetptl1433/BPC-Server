const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createServeFiles,
  listServeFiles,
  listServeFilesByParams,
  getServeFiles,
  updateServeFiles,
  removeServeFiles,
} = require("../controllers/Serve/Serve");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ServeFile");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/ServeFiles",
  upload.single("myFile"),
  catchAsync(createServeFiles)
);

router.get("/auth/list/ServeFiles", catchAsync(listServeFiles));

router.post(
  "/auth/list-by-params/ServeFiles",
  catchAsync(listServeFilesByParams)
);

router.get("/auth/get/ServeFiles/:_id", catchAsync(getServeFiles));

router.put(
  "/auth/update/ServeFiles/:_id",
  upload.single("myFile"),
  catchAsync(updateServeFiles)
);

router.delete(
  "/auth/remove/ServeFiles/:_id",
  catchAsync(removeServeFiles)
);

module.exports = router;
