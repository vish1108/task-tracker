import React, { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("login"); // "login" | "signup" | "dashboard"
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  // If we already have token, go to dashboard
  useEffect(() => {
    if (token) {
      fetchTasks();
      setPage("dashboard");
    }
  }, [token]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // Signup
  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(data.message || "Signed up successfully");
    if (res.ok) setPage("login");
  };

  // Login
  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setPage("dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  };


  // Delete task
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Toggle completion
  const handleToggle = async (id) => {
    const task = tasks.find((t) => t.id === id);
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
    setTasks([]);
  };

  const handleAddTask = async () => {
  if (!newTask.trim()) {
    alert("Task title cannot be empty!");
    return;
  }

  const response = await fetch("http://localhost:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: newTask,
      dueDate,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    setTasks([...tasks, data]);
    setNewTask("");
    setDueDate("");
  } else {
    const errorData = await response.json();
    alert(errorData.message);
  }
};


  // ----------------- UI -------------------
  if (page === "login") {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button onClick={handleLogin}>Login</button>
        <p>
          No account?{" "}
          <button onClick={() => setPage("signup")}>Signup</button>
        </p>
      </div>
    );
  }

  if (page === "signup") {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Signup</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button onClick={handleSignup}>Signup</button>
        <p>
          Already have an account?{" "}
          <button onClick={() => setPage("login")}>Login</button>
        </p>
      </div>
    );
  }

  if (page === "dashboard") {
    return (
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <h2>Dashboard</h2>

        <h3>Add Task</h3>
        <input
          placeholder="Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>


        <h3>Your Tasks</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((t) => (
            <li key={t.id}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleToggle(t.id)}
              />
              {t.title} ({t.dueDate || "No date"})
              <button onClick={() => handleDelete(t.id)}>❌</button>
            </li>
          ))}
        </ul>

        {/* ✅ Logout moved to bottom */}
        <div style={{ marginTop: 40 }}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;

