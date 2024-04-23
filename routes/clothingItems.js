const router = require("express").Router();

router.get("/", () => console.log("Get Item"));
router.post("/", () => console.log("Create New Item"));
router.delete("/:itemId", () => console.log("Delete Item"));

module.exports = router;
