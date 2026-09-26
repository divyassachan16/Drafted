require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const List = require("../../models/List");
const Task = require("../../models/Task");

async function run() {
  await connectDB();

  const blocked = await List.findOne({ title: "Blocked" });
  if (blocked) {
    const { deletedCount } = await Task.deleteMany({ list: blocked._id });
    await List.deleteOne({ _id: blocked._id });
  }

  const result = await Task.deleteMany({ done: true });

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
