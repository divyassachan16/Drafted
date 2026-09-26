const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    done: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    dueDate: { type: Date },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    list: { type: Schema.Types.ObjectId, ref: "List", required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
