const Board = require("../schema/Board");
const List = require("../schema/List");
const Task = require("../schema/Task");

async function requireBoardOwner(req, res, next) {
  debugger;
  const board = await Board.findById(req.params.boardId);
  if (!board || board.owner.toString() !== req.user.id) {
    return res.status(404).json({ error: "Board not found" });
  }

  req.board = board;
  next();
}

async function requireListOwner(req, res, next) {
  const list = await List.findById(req.params.listId);
  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  const board = await Board.findById(list.board);
  if (!board || board.owner.toString() !== req.user.id) {
    return res.status(404).json({ error: "List not found" });
  }

  req.list = list;
  req.board = board;
  next();
}

async function requireTaskOwner(req, res, next) {
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const list = List.findById(task.list);
  if (!list) {
    return res.status(404).json({ error: "Task not found" });
  }

  const board = await Board.findById(list.board);
  if (!board || board.owner.toString() !== req.user.id) {
    return res.status(404).json({ error: "Task not found" });
  }

  req.task = task;
  req.list = list;
  req.board = board;
  next();
}

module.exports = {
  requireBoardOwner,
  requireListOwner,
  requireTaskOwner,
};
