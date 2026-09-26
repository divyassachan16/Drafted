require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const Task = require("../../models/Task");
const List = require("../../models/List");

async function run() {
  await connectDB();

  const task = await Task.findOne({
    title: "Connect Angular frontend to REST API",
  });
  task.done = true;
  await task.save();

  await Task.updateOne(
    { title: "Waiting on staging DB credentials" },
    { $set: { priority: "high" } },
  );

  await List.updateMany(
    { title: { $in: ["In progress", "Done"] } },
    { $set: { position: 10 } },
  );

  const reordered = await List.find({}).sort({ position: 1 });

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
