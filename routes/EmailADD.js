const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createEmailControl, listEmailControl, listActiveEmailControl, listEmailControlByParams, getEmailControl, updateEmailControlMaster, removeEmailControlMaster } = require("../controllers/EmailADD/EmailADD");
const multer = require('multer');
const upload = multer();

router.post("/auth/EmailControl", upload.none(), catchAsync(createEmailControl));
router.get("/auth/list/EmailControl", catchAsync(listEmailControl));

router.get(
  "/auth/list-active/EmailControl",
  catchAsync(listActiveEmailControl)
);

router.post(
  "/auth/list-by-params/EmailControl",
  catchAsync(listEmailControlByParams)
);

router.get("/auth/get/EmailControl/:_id", catchAsync(getEmailControl));

router.put(
  "/auth/update/EmailControl/:_id",upload.none(),
  catchAsync(updateEmailControlMaster)
);

router.delete(
  "/auth/remove/EmailControl/:_id",
  catchAsync(removeEmailControlMaster)
);


module.exports = router;