require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./../config/db");

const User = require("./../schema/User");
const Board = require("./../schema/Board");
const List = require("./../schema/List");
const Task = require("./../schema/Task");
const { hashPassword } = require("../utils/Password");

const SEED_PASSWORD = "password123";

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Board.deleteMany({}),
    List.deleteMany({}),
    Task.deleteMany({}),
  ]);

  const passwordHash = await hashPassword(SEED_PASSWORD);
  const [aarav, riya, mark] = await User.insertMany([
    {
      name: "Aarav Kapoor",
      email: "aarav@email.com",
      passwordHash,
    },
    {
      name: "Riya Sharma",
      email: "riya@email.com",
      passwordHash,
    },
    {
      name: "Mark Tan",
      email: "mark@email.com",
      passwordHash,
    },
  ]);

  const board = await Board.create({
    title: "Work Projects",
    owner: aarav._id,
  });

  const [todo, inProgress, done] = await List.insertMany([
    { title: "To do", position: 0, board: board._id },
    { title: "In progress", position: 1, board: board._id },
    { title: "Done", position: 2, board: board._id },
  ]);

  await Task.insertMany([
    {
      title: "Design database schema for boards & tasks",
      priority: "high",
      dueDate: new Date("2026-09-20"),
      assignee: aarav._id,
      position: 0,
      list: todo._id,
    },
    {
      title: "Set up Node + Express project structure",
      priority: "low",
      dueDate: new Date("2026-09-21"),
      assignee: aarav._id,
      position: 1,
      list: todo._id,
    },
    {
      title: "Build JWT authentication + refresh tokens",
      priority: "high",
      dueDate: new Date("2026-09-22"),
      assignee: aarav._id,
      position: 0,
      list: inProgress._id,
    },
    {
      title: "Connect Angular frontend to REST API",
      priority: "medium",
      dueDate: new Date("2026-09-25"),
      assignee: mark._id,
      position: 1,
      list: inProgress._id,
    },
    {
      title: "Project kickoff & scope outline",
      priority: "low",
      done: true,
      position: 0,
      list: done._id,
    },
    {
      title: "Repo setup & CI pipeline",
      priority: "low",
      done: true,
      assignee: riya._id,
      position: 1,
      list: done._id,
    },
  ]);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
