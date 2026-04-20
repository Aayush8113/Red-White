require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

fs.mkdirSync(path.join(__dirname, "public", "uploads"), { recursive: true });

app.use(helmet({ contentSecurityPolicy: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Connected to MongoDB"))
  .catch((err) => console.error("DB connection failed:", err));

app.get("/", (req, res) => res.redirect("/todos"));
app.use("/todos", require("./routes/todoRoutes"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
