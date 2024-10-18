const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createCoursesFun, listCoursesFun, listActiveCoursesFun, listCoursesFunByParams, getCoursesFun, updateCoursesFunMaster, removeCoursesFunMaster, getCoursesFunByName } = require("../controllers/Courses/CoursesController");
const multer = require('multer');
const upload = multer();

router.post("/auth/CoursesFun", upload.none(), catchAsync(createCoursesFun));
router.get("/auth/list/CoursesFun", catchAsync(listCoursesFun));

router.get(
  "/auth/list-active/CoursesFun",
  catchAsync(listActiveCoursesFun)
);

router.post(
  "/auth/list-by-params/CoursesFun",
  catchAsync(listCoursesFunByParams)
);

router.get("/auth/get/CoursesFun/:_id", catchAsync(getCoursesFun));

router.get("/auth/get/CoursesFunByName/:Name", catchAsync(getCoursesFunByName));


router.put(
  "/auth/update/CoursesFun/:_id",upload.none(),
  catchAsync(updateCoursesFunMaster)
);

router.delete(
  "/auth/remove/CoursesFun/:_id",
  catchAsync(removeCoursesFunMaster)
);


module.exports = router;