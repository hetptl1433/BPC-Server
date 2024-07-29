const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createYTDesc, listYTDesc, listActiveYTDesc, listYTDescByParams, getYTDesc, updateYTDescMaster, removeYTDescMaster } = require("../controllers/NEWS/NewsController");
const multer = require('multer');
const upload = multer();

router.post("/auth/Newsdesc", upload.none(), catchAsync(createYTDesc));
router.get("/auth/list/Newsdesc", catchAsync(listYTDesc));

router.get(
  "/auth/list-active/Newsdesc",
  catchAsync(listActiveYTDesc)
);

router.post(
  "/auth/list-by-params/Newsdesc",
  catchAsync(listYTDescByParams)
);

router.get("/auth/get/Newsdesc/:_id", catchAsync(getYTDesc));

router.put(
  "/auth/update/Newsdesc/:_id",upload.none(),
  catchAsync(updateYTDescMaster)
);

router.delete(
  "/auth/remove/Newsdesc/:_id",
  catchAsync(removeYTDescMaster)
);


module.exports = router;