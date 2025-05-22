const express = require("express");
const todoRouter = express.Router();
const Todo = require("../models/Todo");
const axios = require("axios");
// Create a new todo
todoRouter.post("/", async (req, res) => {
  try {
    const todo = new Todo(req.body);
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a todo
todoRouter.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all todos
todoRouter.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a todo by ID
todoRouter.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update the exiting
const updateTodo = async (id, updatedTitle) => {
  try {
    const res = await axios.put(`http://localhost:3000/api/todos/${id}`, {
      title: updatedTitle,
    });

    const updatedTodo = res.data;

    setTodos((prev) =>
      prev.map((todo) => (todo._id === id ? updatedTodo : todo))
    );

    setEditingId(null);
    setEditInput("");
  } catch (err) {
    console.error("Error updating todo:", err);
  }
};

// Update a todo
todoRouter.put("/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
todoRouter.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

todoRouter.post("/summarize", async (req, res) => {
  const { todos } = req.body;

  console.log(req.body, todos);

  if (!todos || !Array.isArray(todos) || todos.length === 0) {
    return res
      .status(400)
      .json({ error: "No todos provided for summarization." });
  }

  let inputText = todos.join('. ') + '.';
if (inputText.length < 250) {
  inputText += '.'.repeat(251 - inputText.length);
}

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/summarize",
      {
        text: inputText,
        length: "auto", // short | medium | long | auto
        format: "paragraph", // or 'bullets'
        model: "command", // or 'command-light'
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.summary;
    return res.json({ summary });
  } catch (error) {
    console.error("Cohere API error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: "Failed to summarize todos with Cohere." });
  }
});

module.exports = todoRouter;
