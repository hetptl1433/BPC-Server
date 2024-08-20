const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");


const { createUserGroupMaster, listUserGroupMaster, listUserGroups, listUserGroupMasterByParams, getUserGroupMaster, updateUserGroupMaster, removeUserGroupMaster } = require("../controllers/UserGroup/UserGroup");

router.post(
  "/auth/create/UserGroupMaster",
  catchAsync(createUserGroupMaster)
);

router.get(
  "/auth/list/UserGroupMaster",
  catchAsync(listUserGroupMaster)
);

router.get(
  "/auth/list-active/UserGroupMaster",
  catchAsync(listUserGroups)
);

router.post(
  "/auth/list-by-params/UserGroupMaster",
  catchAsync(listUserGroupMasterByParams)
);

router.get(
  "/auth/get/UserGroupMaster/:_id",
  catchAsync(getUserGroupMaster)
);

router.put(
  "/auth/update/UserGroupMaster/:_id",
  catchAsync(updateUserGroupMaster)
);

router.delete(
  "/auth/remove/UserGroupMaster/:_id",
  catchAsync(removeUserGroupMaster)
);

module.exports = router;
