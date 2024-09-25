const express = require("express");
const router = express.Router();
const { fetchExamMasterData, fetchUserData, fetchTestCategoryData, fetchExamDetailData, fetchAllPoint } = require("../controllers/OldResultData/OldResulData");

// Route to fetch exam details based on examId and userId
router.get("/legacyTestData/:userId/:examId", fetchExamMasterData);
router.get("/legacyExamDetails/:userId/:testCategoryId", fetchExamDetailData);

router.get("/legacyTestData/:userId", fetchUserData);
router.get("/legacyTestCategoryData/:testCategoryId", fetchTestCategoryData);

router.get("/legacyAllPoint/:testCategoryId", fetchAllPoint);










module.exports = router;
