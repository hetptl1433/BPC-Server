// routes/resultSearchRoutes.js
const express = require("express");
const {
  fetchResultSearchModel,
} = require("../controllers/OldResultSearch/OldResultSearch");

const router = express.Router();

// Define the route for fetching the ResultSearchModel
router.get("/result-search", fetchResultSearchModel);

module.exports = router;
