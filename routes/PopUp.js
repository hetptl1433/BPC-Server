const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createPopUpFile,
  listPopUpFile,
  listPopUpFileByParams,
  getPopUpFile,
  updatePopUpFile,
  removePopUpFile,
  listActivePopUpFile,
} = require("../controllers/Popup/PopUp");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/PopUpFile");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/PopUpFile",
  upload.single("myFile"),
  catchAsync(createPopUpFile)
);

router.get("/auth/list/PopUpFile", catchAsync(listPopUpFile));
router.get("/auth/list-active/PopUpFile", catchAsync(listActivePopUpFile));

router.post(
  "/auth/list-by-params/PopUpFile",
  catchAsync(listPopUpFileByParams)
);

router.get("/auth/get/PopUpFile/:_id", catchAsync(getPopUpFile));

router.put(
  "/auth/update/PopUpFile/:_id",
  upload.single("myFile"),
  catchAsync(updatePopUpFile)
);

router.delete(
  "/auth/remove/PopUpFile/:_id",
  catchAsync(removePopUpFile)
);

module.exports = router;
