const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

// router.get("/", getUsers);

// router.get("/:userId", auth, getUser);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateUser);

module.exports = router;
