const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const role = require("../middleware/roleMiddleware");
const auth = require("../middleware/authMiddleware"); // IMPORTANT

const {
  createPerson,
  getTree,
  marry,
  updatePerson,
  deletePerson
} = require("../controllers/personController");


// public
router.get("/tree", getTree);


// protected routes
router.post(
  "/add",
  auth,                     // MUST be first
  role("ADMIN","SUPER_ADMIN"),
  upload.single("profileImage"),
  createPerson
);

router.put(
  "/update/:id",
  auth,
  role("ADMIN","SUPER_ADMIN"),
  upload.single("profileImage"),
  updatePerson
);

router.delete(
  "/delete/:id",
  auth,
  role("ADMIN","SUPER_ADMIN"),
  deletePerson
);

router.put(
  "/marry/:id",
  auth,
  role("ADMIN","SUPER_ADMIN"),
  marry
);

module.exports = router;