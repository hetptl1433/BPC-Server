const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createCourseForm,
  getCourseForm,
  listActiveCategories,
  removeCourseFormMaster,
  updateCourseFormMaster,
  listCourseForm,
  listActiveCourseForm,
  listCourseFormByParams,
  removeCourseForm,
} = require("../controllers/Forms/CourseForm");

router.post("/auth/CourseForm", catchAsync(createCourseForm));
router.get("/auth/list/CourseForm", catchAsync(listCourseForm));

router.get("/auth/list-active/CourseForm", catchAsync(listActiveCourseForm));

router.post("/auth/list-by-params/CourseForm", catchAsync(listCourseFormByParams));

router.get("/auth/get/CourseForm/:_id", catchAsync(getCourseForm));

router.put("/auth/update/CourseForm/:_id", catchAsync(updateCourseFormMaster));

router.delete("/auth/remove/CourseForm/:_id", catchAsync(removeCourseForm));

module.exports = router;
