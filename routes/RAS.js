const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createRAS,
  getRAS,
  listRAS,
  listActiveRAS,
  listRASByParams,
  updateRAS,
  removeRAS,
} = require("../controllers/RAS/RAS");

router.post("/auth/RAS", catchAsync(createRAS));
router.get("/auth/list/RAS", catchAsync(listRAS));

router.get("/auth/list-active/RAS", catchAsync(listActiveRAS));

router.post("/auth/list-by-params/RAS", catchAsync(listRASByParams));

router.get("/auth/get/RAS/:_id", catchAsync(getRAS));

router.put("/auth/update/RAS/:_id", catchAsync(updateRAS));

router.delete("/auth/remove/RAS/:_id", catchAsync(removeRAS));

module.exports = router;
