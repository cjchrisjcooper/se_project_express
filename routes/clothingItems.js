const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validatecreateItems,
  validateId,
} = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", auth, validatecreateItems, createClothingItem);
router.delete("/:itemId", auth, validateId, deleteClothingItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
