const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createEmailMaster, listEmailMaster, listActiveEmailMaster, listEmailMasterByParams, getEmailMaster, updateEmailMasterMaster, removeEmailMasterMaster } = require("../controllers/EmailMaster/EmailMaster");
const multer = require('multer');
const upload = multer();

router.post("/auth/EmailMaster", upload.none(), catchAsync(createEmailMaster));
router.get("/auth/list/EmailMaster", catchAsync(listEmailMaster));

router.get(
  "/auth/list-active/EmailMaster",
  catchAsync(listActiveEmailMaster)
);

router.post(
  "/auth/list-by-params/EmailMaster",
  catchAsync(listEmailMasterByParams)
);

router.get("/auth/get/EmailMaster/:_id", catchAsync(getEmailMaster));

router.put(
  "/auth/update/EmailMaster/:_id",upload.none(),
  catchAsync(updateEmailMasterMaster)
);

router.delete(
  "/auth/remove/EmailMaster/:_id",
  catchAsync(removeEmailMasterMaster)
);


module.exports = router;