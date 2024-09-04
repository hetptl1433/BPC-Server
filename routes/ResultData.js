const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createResultData, listResultData, listActiveResultData, listResultDataByParams, getResultData, updateResultDataMaster, removeResultDataMaster} = require("../controllers/ResultData/ResultData");
const multer = require('multer');
const upload = multer();

router.post("/auth/create/ResultData", upload.none(), catchAsync(createResultData));
router.get("/auth/list/ResultData", catchAsync(listResultData));

router.get(
  "/auth/list-active/ResultData",
  catchAsync(listActiveResultData)
);

router.post(
  "/auth/list-by-params/ResultData",
  catchAsync(listResultDataByParams)
);

router.get("/auth/get/ResultData/:_id", catchAsync(getResultData));



router.put(
  "/auth/update/ResultData/:_id",upload.none(),
  catchAsync(updateResultDataMaster)
);

router.delete(
  "/auth/remove/ResultData/:_id",
  catchAsync(removeResultDataMaster)
);


module.exports = router;