const router = require("express").Router();

const { createUser, loginUser } = require("../controllers/users");
const {
  validateLogin,
  validateCreateUser,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, loginUser);
router.post("/signup", validateCreateUser, createUser);

module.exports = router;
