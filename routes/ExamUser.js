const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { userLoginExamUser, getExamUser, listExamUser } = require("../controllers/Auth/User/IndustryUserMaster");
const requireAuth = require("../middlewares/ExamUser");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/userImages");
//   },
//   filename: (req, file, cb) => {
//     // const ext = file.mimetype.split("/")[1];
//     // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });

// const upload = multer({ storage: multerStorage });

router.post("/ExamUserLogin", catchAsync(userLoginExamUser));
router.get("/ExamUser/:_id", requireAuth, catchAsync(getExamUser)); // Protected route
router.get("/listExamUser", requireAuth, catchAsync(listExamUser)); 

module.exports = router;
