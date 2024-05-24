const router = require("express").Router();

const {
  getUsers,
  createUser,
  getUser,
  loginUser,
} = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
router.get("/signin", loginUser);
router.post("/signup", createUser);

module.exports = router;
