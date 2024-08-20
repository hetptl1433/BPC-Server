const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const { createContentContact, listContentContact, listActiveContentContact, listContentContactByParams, getContentContact, updateContentContact, removeContentContact } = require("../controllers/ContentContact/ContentContact");

router.post("/auth/ContentContact", catchAsync(createContentContact));
router.get("/auth/list/ContentContact", catchAsync(listContentContact));

router.get(
  "/auth/list-active/ContentContact",
  catchAsync(listActiveContentContact)
);

router.post(
  "/auth/list-by-params/ContentContact",
  catchAsync(listContentContactByParams)
);

router.get("/auth/get/ContentContact/:_id", catchAsync(getContentContact));

router.put(
  "/auth/update/ContentContact/:_id",
  catchAsync(updateContentContact)
);

router.delete(
  "/auth/remove/ContentContact/:_id",
  catchAsync(removeContentContact)
);


module.exports = router;