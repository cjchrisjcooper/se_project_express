const { Error } = require("mongoose");
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
//GET users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

//GER user
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name == "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      } else if (err.name == "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: err.message });
      }
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

//POST user
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  User.create({ name, avatar })
    .then((user) => {
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
