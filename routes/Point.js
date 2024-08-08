const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");


const { createPoint, listPoint, listLEDActiveCategories, listPointByParams, getPoint, updatePoint, removePoint } = require("../controllers/Points/Points");

router.post(
  "/auth/create/Point",
  catchAsync(createPoint)
);

router.get(
  "/auth/list/Point",
  catchAsync(listPoint)
);

router.get(
  "/auth/list-active/Point",
  catchAsync(listLEDActiveCategories)
);

router.post(
  "/auth/list-by-params/Point",
  catchAsync(listPointByParams)
);

router.get(
  "/auth/get/Point/:_id",
  catchAsync(getPoint)
);

router.put(
  "/auth/update/Point/:_id",
  catchAsync(updatePoint)
);

router.delete(
  "/auth/remove/Point/:_id",
  catchAsync(removePoint)
);

module.exports = router;
