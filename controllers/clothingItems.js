const { Error } = require("mongoose");
const clothingItems = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");
//GET items
const getClothingItems = (req, res) => {
  clothingItems
    .find({})
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ _message: err.message });
    });
};

//DELETE item
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndRemove(itemId)
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name == "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ _message: err.message });
      } else if (err.name == "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ _message: err.message });
      }
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ _message: err.message });
    });
};

//POST item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, likes, createdAt } = req.body;
  const owner = req.user._id;
  console.log(name, weather, imageUrl, req.user._id, likes, createdAt);

  clothingItems
    .create({ name, weather, imageUrl, owner, likes, createdAt })
    .then((item) => {
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ _message: err.message });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ _message: err.message });
    });
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
