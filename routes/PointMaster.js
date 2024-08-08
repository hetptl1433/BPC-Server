const express = require("express");

const router = express.Router();

const {
 

  listPointMaster,
  removePointMaster,
  listPointMasterByParams,
  createPointMaster,
  getPointMaster,
  updatePointMaster,

 
} = require("../controllers/PointMasters/PointMasters");

const catchAsync = require("../utils/catchAsync");


//location setup ---> PointMaster
router.get("/auth/location/PointMaster", catchAsync(listPointMaster));
router.post("/auth/location/PMParam", catchAsync(listPointMasterByParams));
router.delete("/auth/location/PointMaster/:_id", catchAsync(removePointMaster));
router.get("/auth/location/PointMaster/:_id", catchAsync(getPointMaster));

router.post("/auth/location/PointMaster", catchAsync(createPointMaster));
router.put("/auth/location/PointMaster/:_id", catchAsync(updatePointMaster));

module.exports = router;
