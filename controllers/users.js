const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: "Not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid data" });
      }
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log(name, avatar, email, password);
  if (!email) {
    return res
      .status(ERROR_CODES.INVALID_DATA)
      .send({ message: "Invalid data" });
  }
  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send(userObj);
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          return res
            .status(ERROR_CODES.Conflict)
            .send({ message: "Email already exists" });
        }
        if (err.name === "ValidationError") {
          return res
            .status(ERROR_CODES.INVALID_DATA)
            .send({ message: "Invalid data" });
        }
        return res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      })
      .catch((err) => res.status(err.status).send({ message: err.message }));
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log("this method is being called.");
  console.log(email, password);
  //find the user in the database based the email we passed in
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
      res.status(err.status).send({
        message: err.message,
      });
    });
};

module.exports = { getUsers, createUser, getUser, loginUser };
