const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", auth, getUser);

router.get("/me", getCurrentUser);

router.patch("/me", updateUser);

module.exports = router;
