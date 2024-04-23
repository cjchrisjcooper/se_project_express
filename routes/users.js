const router = require("express").Router();

router.get("/", () => console.log("Get Users"));
router.get("/:userId", () => console.log("Get user"));
router.post("/", () => console.log("Create New User"));

module.exports = router;
