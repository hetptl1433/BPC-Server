const express = require("express");
const { fetchExamMasterData } = require("../controllers/OldResult/OldResult");

const router = express.Router();

// Route to fetch exam data by TestCategoryId
// router.get("/auth/get/OldResultData/:id", fetchExamMasterData);

router.post("/auth/list-by-params/OldResultData/:id", fetchExamMasterData);

module.exports = router;
