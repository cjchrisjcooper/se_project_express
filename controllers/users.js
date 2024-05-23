const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const bcrypt = require("bcryptjs");
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
  //find the user in the database based the email we passed in
  User.findUserByCredentials({ email })
    .then((user) => {
      //if the user is not found pass an error
      if (!user) {
        return Promise.reject(new Error("Incorrect password or email"));
      }
      //if the user is found we will compare the password we logged in with the password from the database
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      //if the passwords didn't match, throw an error
      if (!matched) {
        return Promise.reject(new Error("Incorrect password or email"));
      }
      //if the passwords did match, send a successful message
      res.send({ message: "Congrats! You have logged in" });
    })
    .catch((err) => {
      res.status(err.status).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser, loginUser };
