const { Error } = require("mongoose");
const clothingItems = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");
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
        .send({ message: err.message });
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
      console.error(err);
      if (err.name == "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      } else if (err.name == "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: err.message });
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: err.message });
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
          .send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

//like an item
const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  clothingItems
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      console.log(res.status);
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name == "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
};

//un-like an item
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: err.message });
    });
module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
