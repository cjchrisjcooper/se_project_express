const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const signRouter = require("./sign");
const { NotFoundError } = require("../middlewares/NotFoundError");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use("/", signRouter);
router.use(() => {
  throw new NotFoundError("Not Found");
});

module.exports = router;
