// routes/testCategoryRoutes.js
const express = require("express");
const {
  fetchTestCategories,
} = require("../controllers/OldTestCategory/OldTestCategory");

const router = express.Router();

// Route to fetch the TestCategoryMaster data
router.post("/legacy-test-categories", fetchTestCategories);

module.exports = router;
