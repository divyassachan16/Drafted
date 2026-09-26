const List = require("../schema/List");

exports.create = async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const lastList = await List.findOne({ board: req.board._id }).sort({
    position: -1,
  });

  const position = lastList ? lastList.position + 1 : 0;
  const list = await List.create({
    title: title.trim(),
    position,
    board: req.board._id,
  });
  res.status(201).json({ list });
};

exports.listForBoard = async (req, res) => {
  const lists = await List.find({ board: req.board._id }).sort({ position: 1 });
  res.status(200).json({ lists });
};

exports.rename = async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  req.list.title = title.trim();
  await req.list.save();
  res.status(200).json({ list: req.list });
};

exports.reorder = async (req, res) => {
  const { orderedListIds } = req.body;
  if (!Array.isArray(orderedListIds) || orderedListIds.length == 0) {
    return res
      .status(400)
      .json({ error: "orderedListIds must be a non-empty array" });
  }

  const existingLists = await List.find({ board: req.board._id });
  const existingIds = new Set(existingLists.map((l) => l._id.toString()));

  const isValidSet =
    orderedListIds.length === existingIds.size &&
    orderedListIds.every((id) => existingIds.has(id));

  if (!isValidSet) {
    return res.status(400).json({
      error: "orderedListIds must match exactly the lists on this board",
    });
  }

  await Promise.all(
    orderedListIds.map((id, index) =>
      List.updateOne({ _id: id }, { $set: { position: index } }),
    ),
  );

  const lists = await List.find({ board: req.board._id }).sort({ positon: 1 });
  res.status(200).json({ lists });
};

exports.remove = async (req, res) => {
  await Task.deleteMany({ list: req.list._id });
  await List.deleteOne({ _id: req.list._id });
  res.status(204).send();
};
