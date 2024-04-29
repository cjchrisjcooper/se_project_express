const router = require("express").Router();
const ERROR_CODES = require("../utils/errors");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { REQUEST_CREATED } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) =>
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Not Found" }),
);

module.exports = router;
