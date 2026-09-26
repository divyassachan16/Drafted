require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const helloRoutes = require("./src/routes/hello.routes");
const authRoutes = require("./src/routes/Auth.routes");
const boardRoutes = require("./src/routes/Board.routes");
const listRoutes = require("./src/routes/List.routes");
const tasksRoutes = require("./src/routes/Tasks.routes");
const requireAuth = require("./src/middleware/auth.middleware");

const app = express();
const PORT = process.env.PORT || 3000;
// mongoose.connect("mongodb://localhost:27017", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Middleware — parses incoming JSON bodies into req.body
app.use(express.json());

// Tiny logging middleware, just to show the pattern
app.use((req, res, next) => {
  console.log("In another middleware");
  next();
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/hello", helloRoutes);
app.use("/api/boards", requireAuth, boardRoutes);
app.use("/api/lists", requireAuth, listRoutes);
app.use("/api/tasks", requireAuth, tasksRoutes);

// 404 handler
app.use((req, res) => {
  console.log("In another 404 middleware", req.url);
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Validation Failed", details });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  res.status(500).json({ error: "Something broke!!!" });
});

// // Error handler
// app.use((err, req, res, next) => {
//   console.log("", err);
//   res.status(500).json({ error: "Error Occurred." });
// });

// const server = http.createServer(app);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Drafted service is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB: " + err.message);
    process.exit(1);
  });
