const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createResultAns, listResultAns, listActiveResultAns, listResultAnsByParams, getResultAns, updateResultAnsMaster, removeResultAnsMaster, getResultAnsAndData } = require("../controllers/ResultAns/ResultAns");
const multer = require('multer');
const upload = multer();

router.post("/auth/create/ResultAns", upload.none(), catchAsync(createResultAns));
router.get("/auth/list/ResultAns", catchAsync(listResultAns));

router.get(
  "/auth/list-active/ResultAns",
  catchAsync(listActiveResultAns)
);

router.post(
  "/auth/list-by-params/ResultAns",
  catchAsync(listResultAnsByParams)
);

router.get("/auth/get/ResultAns/:_id", catchAsync(getResultAns));

router.put(
  "/auth/update/ResultAns/:_id",upload.none(),
  catchAsync(updateResultAnsMaster)
);

router.delete(
  "/auth/remove/ResultAns/:_id",
  catchAsync(removeResultAnsMaster)
);

router.get(
  "/auth/get/ResultAns/:userID/:testID",
  catchAsync(getResultAnsAndData)
);

module.exports = router;