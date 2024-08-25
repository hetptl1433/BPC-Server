const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createContactForm,
  getContactForm,
  listActiveCategories,
  removeContactFormMaster,
  updateContactFormMaster,
  listContactForm,
  listActiveContactForm,
  listContactFormByParams,
  removeContactForm,
} = require("../controllers/Forms/ContactForm");

router.post("/auth/ContactForm", catchAsync(createContactForm));
router.get("/auth/list/ContactForm", catchAsync(listContactForm));

router.get("/auth/list-active/ContactForm", catchAsync(listActiveContactForm));

router.post("/auth/list-by-params/ContactForm", catchAsync(listContactFormByParams));

router.get("/auth/get/ContactForm/:_id", catchAsync(getContactForm));

router.put("/auth/update/ContactForm/:_id", catchAsync(updateContactFormMaster));

router.delete("/auth/remove/ContactForm/:_id", catchAsync(removeContactForm));

module.exports = router;
