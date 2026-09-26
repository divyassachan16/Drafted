const mongoose = require("mongoose");
const { Schema } = mongoose;

const listSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    position: { type: Number, default: 0 },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("List", listSchema);
