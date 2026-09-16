const express = require("express");
const helloRoutes = require("./src/routes/hello.routes");

const app = express();

// Middleware — parses incoming JSON bodies into req.body
app.use(express.json());

// Tiny logging middleware, just to show the pattern
app.use((req, res, next) => {
  console.log("In another middleware");
  next();
});

// Mount Routes
app.use("/api/hello", helloRoutes);

// 404 handler
app.use((req, res) => {
  console.log("In another 404 middleware");
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.log("", err);
  res.status(500).json({ error: "Error Occurred." });
});

// const server = http.createServer(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
