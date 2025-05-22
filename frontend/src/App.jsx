import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const updateTodo = async (id, updatedTitle) => {
    if (!updatedTitle.trim()) return;

    try {
      const res = await axios.put(`http://localhost:3000/${id}`, {
        title: updatedTitle, // assuming your backend expects "title"
      });

      const updatedTodo = res.data;
      console.log(updatedTodo);

      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      setEditingId(null);
      setEditInput("");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/", {
        title: input, // assuming your backend expects "title"
      });

      const newTodo = res.data;
      console.log(newTodo);

      setTodos((prev) => [...prev, newTodo]);
      setInput("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id) => {
    await fetch(`${"http://localhost:3000/"}${id}`, { method: "PUT" });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${"http://localhost:3000/"}${id}`);
    fetchTodos();
  };
  const handleSummarize = async () => {
    try {
      // Convert todo objects to text
      const todoTexts = todos.map((todo) => todo.text); // Adjust if todo structure differs

      const response = await axios.post("http://localhost:3000/summarize", {
        todos: todoTexts,
      });

      setSummary(response.data.summary);
    } catch (err) {
      console.error("Failed to summarize:", err);
      setSummary("Error: Could not generate summary");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="New Todo"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2">
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex justify-between items-center mb-2">
            {editingId === todo._id ? (
              <div className="flex gap-2 flex-grow">
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  className="border p-1 flex-grow"
                />
                <button
                  onClick={() => updateTodo(todo._id, editInput)}
                  className="text-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditInput("");
                  }}
                  className="text-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo._id)}
                  className={`cursor-pointer flex-grow ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(todo._id);
                      setEditInput(todo.title);
                    }}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-red-500"
                  >
                    X
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSummarize}>Summarize Todos</button>
        {summary && (
          <div
            style={{
              marginTop: "1rem",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <strong>Summary:</strong>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
