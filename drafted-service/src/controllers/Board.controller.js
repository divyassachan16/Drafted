const Board = require("../schema/Board");
const List = require("../schema/List");

exports.create = async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  debugger;
  const board = await Board.create({
    title: title.trim(),
    owner: req.user.id,
  });
  res.status(201).json({ board });
};

exports.list = async (req, res) => {
  const boards = await Board.find({ owner: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ boards });
};

exports.getOne = async (req, res) => {
  res.status(200).json({ board: req.board });
};

exports.rename = async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  req.board.title = title.trim();
  await req.board.save();
  res.status(200).json({ board: req.board });
};

exports.remove = async (req, res) => {
  const lists = await List.find({ board: req.board._id });
  const listIds = lists.map((l) => l._id);

  await Task.deleteMany({ list: { $in: listIds } });
  await List.deleteMany({ board: req.board._id });
  await Board.deleteMany({ _id: req.board._id });

  res.status(204).send();
};
