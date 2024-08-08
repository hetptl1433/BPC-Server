const express = require("express");

const router = express.Router();

const {
 

  listTestQuestionMaster,
  removeTestQuestionMaster,
  listTestQuestionMasterByParams,
  createTestQuestionMaster,
  getTestQuestionMaster,
  updateTestQuestionMaster,

 
} = require("../controllers/TestQuestionMaster/TestQuestionMaster");

const catchAsync = require("../utils/catchAsync");


//location setup ---> TestQuestionMaster
router.post ("/auth/location/TestQuestionMaster", catchAsync(listTestQuestionMaster));
router.post("/auth/location/TestQuestionParam", catchAsync(listTestQuestionMasterByParams));
router.delete("/auth/location/TestQuestionMaster/:_id", catchAsync(removeTestQuestionMaster));
router.get("/auth/location/TestQuestionMaster/:_id", catchAsync(getTestQuestionMaster));

router.post(
  "/auth/location/create/TestQuestionMaster",
  catchAsync(createTestQuestionMaster)
);
router.put("/auth/location/TestQuestionMaster/:_id", catchAsync(updateTestQuestionMaster));

module.exports = router;
