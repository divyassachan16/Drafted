const List = require("../schema/List");
const Task = require("../schema/Task");
const User = require("../schema/User");

const ALLOWED_PRIORITIES = ["low", "medium", "high"];

async function validateTaskFields({ priority, dueDate, assignee }) {
  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    return `Priority must be one of: ${ALLOWED_PRIORITIES.join(", ")}`;
  }

  if (
    dueDate !== undefined &&
    dueDate !== null &&
    Number.isNaN(Date.parse(dueDate))
  ) {
    return "dueDate must be a valid date";
  }

  if (assignee !== undefined && assignee !== null) {
    const user = await User.findById(assignee);
    if (!user) return "Assignee must be a valid user id";
  }

  return null;
}

exports.create = async (req, res) => {
  const { title, description, priority, dueDate, assignee } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const validationError = await validateTaskFields({
    priority,
    dueDate,
    assignee,
  });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const lastTask = await Task.findOne({ list: req.list._id }).sort({
    position: -1,
  });
  const position = lastTask ? lastTask.position + 1 : 0;

  const task = await Task.create({
    title: title.trim(),
    description: description || "",
    dueDate: dueDate || undefined,
    priority: priority || "low",
    assignee: assignee || undefined,
    position,
    list: req.list._id,
  });

  res.status(201).json({ task });
};

exports.listForList = async (req, res) => {
  const tasks = await Task.find({ list: req.list._id }).sort({ position: 1 });
  res.status(200).json({ tasks });
};

exports.getOne = async (req, res) => {
  res.status(200).json({ task: req.task });
};

exports.update = async (req, res) => {
  const { title, description, priority, dueDate, assignee } = req.body;

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  const validationError = await validateTaskFields({
    priority,
    dueDate,
    assignee,
  });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (title !== undefined) req.task.title = title.trim();
  if (description !== undefined) req.task.description = description;
  if (priority !== undefined) req.task.priority = priority;
  if (dueDate !== undefined) req.task.dueDate = dueDate || null;
  if (assignee !== undefined) req.task.assignee = assignee || null;

  await req.task.save();
  res.status(200).json({ task: req.task });
};

exports.toggleComplete = async (req, res) => {
  const { done } = req.body;

  req.task.done = typeof done === "boolean" ? done : !req.task.done;

  await req.task.save();
  res.status(200).json({ task: req.task });
};

exports.remove = async (req, res) => {
  await Task.deleteOne({ _id: req.task._id });
  res.status(204).send();
};

exports.move = async (req, res) => {
  const { listId, position } = req.body;
  if (!listId || typeof position !== "number" || position < 0) {
    return res.status(400).json({
      error: "listId and a non-negative numeric position are required",
    });
  }

  const targetList = await List.findById(listId);
  if (!targetList) {
    return res.status(400).json({ error: "Target list not found" });
  }

  if (targetList.board.toString() !== req.board._id.toString()) {
    return res
      .status(400)
      .json({ error: "Target list must belong to the same board" });
  }

  const sourceListId = req.task.list.toString();
  const isSameList = sourceListId === listId;

  const siblingsInTarget = await Task.find({
    list: listId,
    _id: { $ne: req.task._id },
  }).sort({ position: 1 });

  const insertAt = Math.min(position, siblingsInTarget.length);
  siblingsInTarget.splice(insertAt, 0, req.task);

  await Promise.all(
    siblingsInTarget.map((t, index) =>
      Task.updateOne(
        { _id: t._id },
        { $set: { position: index, list: listId } },
      ),
    ),
  );

  if (!isSameList) {
    const remainingInSource = await Task.find({ list: sourceListId }).sort({
      position: 1,
    });
    await Promise.all(
      remainingInSource.map((t, index) =>
        Task.updateOne({ _id: t._id }, { $set: { position: index } }),
      ),
    );
  }

  const updatedTask = await Task.findById(req.task._id);
  res.status(200).json({ task: updatedTask });
};
