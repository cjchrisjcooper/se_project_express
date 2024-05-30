// const Error = require("mongoose");
const clothingItems = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

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
        .send({ message: "Server error please try again later" });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res.status(ERROR_CODES.FORBIDDEN).send({
          message: "You need permission to delete this clothing item",
        });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "clothing item has been deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: "Not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid data" });
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Server error please try again later" });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(name, weather, imageUrl, req.user._id);

  clothingItems
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  console.log(itemId);
  console.log(userId);
  clothingItems
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      console.log(res.status);
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: "Not found" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  console.log(itemId);
  console.log(userId);
  clothingItems
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(ERROR_CODES.REQUEST_SUCCESSFUL).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
