const { Error } = require("mongoose");
const clothingItems = require("../models/clothingItem");

//GET items
const getClothingItems = (req, res) => {
  clothingItems
    .find({})
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ _message: err.message });
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
        return res.status(404).send({ _message: err.message });
      } else if (err.name == "CastError") {
        return res.status(400).send({ _message: err.message });
      }
      console.error(err);
      return res.status(500).send({ _message: err.message });
    });
};

//POST item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;
  console.log(name, weather, imageUrl, owner, likes, createdAt);

  clothingItems
    .create({ name, weather, imageUrl, owner, likes, createdAt })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ _message: err.message });
      }
      return res.status(500).send({ _message: err.message });
    });
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
