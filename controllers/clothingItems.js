// const Error = require("mongoose");
const clothingItems = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");
const { BadRequestError } = require("../middlewares/BadRequestError");
const { NotFoundError } = require("../middlewares/NotFoundError");
const { ForbiddenError } = require("../middlewares/ForbiddenError");

const getClothingItems = (req, res, next) => {
  clothingItems
    .find({})
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItems
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        next(new ForbiddenError("You are not authroized to delete this item."));
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "clothing item has been deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }

      next(err);
    });
};

const createClothingItem = (req, res, next) => {
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
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
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
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("not found"));
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
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
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("not found"));
      }
      next(err);
    });
};
module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
