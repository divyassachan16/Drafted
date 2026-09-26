const express = require("express");
const router = express.Router();
const helloController = require("./../controllers/hello.controller");
const requireAuth = require("../middleware/auth.middleware");

router.get("/", requireAuth, helloController.getAll);
router.get("/:id", requireAuth, helloController.getOne);
router.post("/", requireAuth, helloController.create);
router.put("/:id", requireAuth, helloController.update);
router.delete("/:id", requireAuth, helloController.remove);

module.exports = router;
