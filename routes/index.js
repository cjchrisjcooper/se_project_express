const router = require("express").Router();
const ERROR_CODES = require("../utils/errors");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const signRouter = require("./sign");
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use("/", signRouter);
router.use((req, res) =>
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Not Found" }),
);

module.exports = router;
