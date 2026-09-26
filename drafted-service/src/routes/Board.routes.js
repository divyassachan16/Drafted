const express = require("express");
const router = express.Router();
const boardController = require("./../controllers/Board.controller");
const listController = require("./../controllers/List.controller");

const { requireBoardOwner } = require("./../middleware/Ownership.middleware");

router.post("/", boardController.create);
router.get("/", boardController.list);
router.get("/:boardId", requireBoardOwner, boardController.getOne);
router.patch("/:boardId", requireBoardOwner, boardController.rename);
router.delete("/:boardId", requireBoardOwner, boardController.remove);

router.post("/:boardId/lists", requireBoardOwner, listController.create);
router.get("/:boardId/lists", requireBoardOwner, listController.listForBoard);
router.patch(
  "/:boardId/lists/reorder",
  requireBoardOwner,
  listController.reorder,
);

module.exports = router;
