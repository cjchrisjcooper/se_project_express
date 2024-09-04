const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const ERROR_CODES = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../middlewares/BadRequestError");
const { NotFoundError } = require("../middlewares/NotFoundError");
const { ConflictError } = require("../middlewares/ConflictError");
const { UnauthorizedError } = require("../middlewares/UnauthorizedError");

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not found."));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data."));
      }

      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data."));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not found."));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  console.log(req.body);
  console.log("Create user method is working");
  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send(userObj);
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          next(new ConflictError("Email already exists"));
        }
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid data."));
        }
        next(err);
      });
  });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  console.log("this is the object being passed to the controller");
  console.log(req.body);

  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send({
        message: "Authentication successful",
        user: { name: user.name, avatar: user.avatar },
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.message === "Incorrect email") {
        next(new UnauthorizedError("Incorrect Email"));
      }
      if (err.message === "Incorrect password") {
        next(new UnauthorizedError("Incorrect Password"));
      }
      return res.status(err.status).send({ message: err.message });
    });
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
