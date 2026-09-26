const express = require("express");
const router = express.Router();

const listController = require("./../controllers/List.controller");
const taskController = require("./../controllers/Task.controller");
const { requireListOwner } = require("./../middleware/Ownership.middleware");

router.patch("/:listId", requireListOwner, listController.rename);
router.delete("/:listId", requireListOwner, listController.remove);

router.post("/:listId/tasks", requireListOwner, taskController.create);
router.get("/:listId/tasks", requireListOwner, taskController.listForList);

module.exports = router;
