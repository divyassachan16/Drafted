require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./../../config/db");
const User = require("./../../schema/User");
const Board = require("./../../schema/Board");
const List = require("./../../schema/List");
const Task = require("./../../schema/Task");

async function run() {
  await connectDB();

  const owner = await User.findOne({ email: "aarav@email.com" });
  const board = await Board.findOne({ owner: owner._id });

  const newList = await List.create({
    title: "Blocked",
    position: 3,
    board: board._id,
  });

  const newTask = await Task.create({
    title: "Waiting on staging DB credentials",
    priority: "medium",
    list: newList._id,
  });

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
