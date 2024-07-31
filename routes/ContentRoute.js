const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createContent, listContent, listActiveContent, listContentByParams, getContent, updateContentMaster, removeContentMaster } = require("../controllers/ContentController/ContentControl");
const multer = require('multer');
const upload = multer();

router.post("/auth/Content", upload.none(), catchAsync(createContent));
router.get("/auth/list/Content", catchAsync(listContent));

router.get(
  "/auth/list-active/Content",
  catchAsync(listActiveContent)
);

router.post(
  "/auth/list-by-params/Content",
  catchAsync(listContentByParams)
);

router.get("/auth/get/Content/:_id", catchAsync(getContent));

router.put(
  "/auth/update/Content/:_id",upload.none(),
  catchAsync(updateContentMaster)
);

router.delete(
  "/auth/remove/Content/:_id",
  catchAsync(removeContentMaster)
);


module.exports = router;