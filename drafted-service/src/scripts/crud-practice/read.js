require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const Board = require("../../models/Board");
const List = require("../../models/List");
const Task = require("../../models/Task");

async function run() {
  await connectDB();
  const lists = await List.find({}).sort({ position: 1 });

  const inProgress = await List.findOne({ title: "In progress" });
  const tasks = await Task.find({ list: inProgress._id }).sort({ position: 1 });

  const boardWithOwner = await Board.findOne({}).populate("owner");

  const taskWithAssignee = await Task.find({
    assignee: { $ne: null },
  }).populate("assignee", "name email");

  const highPriorityOpenTasks = await Task.find({
    priority: "high",
    done: false,
  });

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
