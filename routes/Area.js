const express = require("express");

const router = express.Router();

const {
  listCountry,
  getCountry,
  listCountryByParams,
  listActiveCountry,

  listState,
  listStateByParams,
  getState,
  listActiveState,

  listCity,
  removeCity,
  listCityByParams,
  createCity,
  getCity,
  updateCity,

 
} = require("../controllers/Location/Location");
const{
   listAreaLoc,
  createAreaLoc,
  listAreaLocByParams,
  removeAreaLoc,
  getAreaLoc,
  updateAreaLoc,
  findAreaLoc,
}= require("../controllers/Location/Area")
const catchAsync = require("../utils/catchAsync");





//location setup ---> country
router.get("/auth/location/country", catchAsync(listCountry));
router.get("/auth/activeLocation/country", catchAsync(listActiveCountry));

router.post("/auth/location/countries", catchAsync(listCountryByParams));
router.get("/auth/location/country/:_id", catchAsync(getCountry));

//location setup ---> state
router.get("/auth/location/state", catchAsync(listState));
router.get("/auth/activeLocation/state", catchAsync(listActiveState));

router.post("/auth/location/states", catchAsync(listStateByParams));
// router.put("/auth/location/state/:_id", removeAndUpdateState);
router.get("/auth/location/state/:_id", catchAsync(getState));

//location setup ---> city
router.get("/auth/location/city", catchAsync(listCity));
router.post("/auth/location/cities", catchAsync(listCityByParams));
router.get("/auth/location/city/:_id", catchAsync(getCity));


//location setup ---> Area
router.get("/auth/location/AreaLoc", catchAsync(listAreaLoc));
router.post("/auth/location/Areas", catchAsync(listAreaLocByParams));
router.delete("/auth/location/AreaLoc/:_id", catchAsync(removeAreaLoc));
router.get("/auth/location/AreaLoc/:_id", catchAsync(getAreaLoc));

router.post("/auth/location/AreaLoc", catchAsync(createAreaLoc));
router.put("/auth/location/AreaLoc/:_id", catchAsync(updateAreaLoc));

module.exports = router;
