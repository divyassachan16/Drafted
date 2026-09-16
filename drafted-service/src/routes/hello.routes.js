const express = require("express");
const router = express.Router();
const helloController = require("./../controllers/hello.controller");

router.get("/", helloController.getAll);
router.get("/:id", helloController.getOne);
router.post("/", helloController.create);
router.put("/:id", helloController.update);
router.delete("/:id", helloController.remove);

module.exports = router;
