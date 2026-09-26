const express = require("express");
const router = express.Router();
const taskController = require("./../controllers/Task.controller");
const { requireTaskOwner } = require("./../middleware/Ownership.middleware");

router.get("/:taskId", requireTaskOwner, taskController.getOne);
router.patch("/:taskId", requireTaskOwner, taskController.update);
router.patch(
  "/:taskId/complete",
  requireTaskOwner,
  taskController.toggleComplete,
);
router.patch("/:taskId/move", requireTaskOwner, taskController.move);
router.delete("/:taskId", requireTaskOwner, taskController.remove);

module.exports = router;
