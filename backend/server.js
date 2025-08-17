const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "secret123"; // for demo only
let users = [{ email: "test@example.com", passwordHash: bcrypt.hashSync("1234", 8) },];
let tasks = []; // [{ id, userEmail, title, dueDate, completed }]

// ✅ Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });
  res.json({ message: "User created" });
});

// ✅ Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// ✅ Middleware to check token
function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// ✅ Get all tasks for logged-in user
app.get("/tasks", auth, (req, res) => {
  const userTasks = tasks.filter((t) => t.userEmail === req.user.email);
  res.json(userTasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { title, dueDate } = req.body;
  const userEmail = req.user.email;

  // 🔴 Validation check
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Task title is required" });
  }

  const newTask = {
    id: tasks.length + 1,
    userEmail,
    title,
    dueDate,
    completed: false,
  };

  tasks.push(newTask);
  res.json(newTask);
});


// ✅ Delete task
app.delete("/tasks/:id", auth, (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(
    (t) => t.id !== taskId || t.userEmail !== req.user.email
  );
  res.json({ message: "Task deleted" });
});

// ✅ Update (toggle) task completion
app.put("/tasks/:id", auth, (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(
    (t) => t.id === taskId && t.userEmail === req.user.email
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // update only completion state (or allow title/dueDate updates too)
  if (typeof req.body.completed === "boolean") {
    task.completed = req.body.completed;
  }

  res.json(task);
});


// ✅ Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
