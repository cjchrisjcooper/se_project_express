const { Error } = require("mongoose");
const User = require("../models/user");

//GET users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ _message: err.message });
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
        return res.status(404).send({ _message: err.message });
      } else if (err.name == "CastError") {
        return res.status(400).send({ _message: err.message });
      }
      console.error(err);
      return res.status(500).send({ _message: err.message });
    });
};

//POST user
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  User.create({ name, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ _message: err.message });
      }
      return res.status(500).send({ _message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
