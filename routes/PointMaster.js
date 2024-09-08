const express = require("express");

const router = express.Router();

const {
 

  listPointMaster,
  removePointMaster,
  listPointMasterByParams,
  createPointMaster,
  getPointMaster,
  updatePointMaster,
  getTestPointMaster,

 
} = require("../controllers/PointMasters/PointMasters");

const catchAsync = require("../utils/catchAsync");


//location setup ---> PointMaster
router.get("/auth/location/PointMaster", catchAsync(listPointMaster));
router.post("/auth/location/PMParam", catchAsync(listPointMasterByParams));
router.delete("/auth/location/PointMaster/:_id", catchAsync(removePointMaster));
router.get("/auth/location/PointMaster/:_id", catchAsync(getPointMaster));
router.get("/auth/location/test/PointMaster/:testId", catchAsync(getTestPointMaster));

router.post("/auth/location/PointMaster", catchAsync(createPointMaster));
router.put("/auth/location/PointMaster/:_id", catchAsync(updatePointMaster));

module.exports = router;
