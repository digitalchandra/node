const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const role = require("../middleware/roleMiddleware");
const auth = require("../middleware/authMiddleware"); // IMPORTANT

const {
  createPerson,
  getTree,
  updatePerson,
  addSpouse,
  deletePerson
} = require("../controllers/personController");


// public get  api 
router.get("/tree", getTree);


// post API
router.post(
  "/add",
  auth,
  role("ADMIN","SUPER_ADMIN"),
  upload.single("profileImage"),
  createPerson
);

router.put(
    "/add-spouse/:id",
    auth,
    role("ADMIN","SUPER_ADMIN"),
    addSpouse
  );

  router.put(
    "/update/:id",
    auth,
    role("ADMIN","SUPER_ADMIN"),
    upload.single("profileImage"),
    updatePerson
  );

router.post(
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


module.exports = router;