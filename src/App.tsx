import { useState, useEffect } from "react"
import "./style.css"

interface Todo {
  id: string
  title: string
  completed: boolean
}

export default function App() {
  const [newItem, setNewItem] = useState<string>("")
  const [todos, setTodos] = useState<Todo[]>(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []
    return JSON.parse(localValue)
  })

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newItem === "") return

    setTodos(currentTodos => [
      ...currentTodos,
      { id: crypto.randomUUID(), title: newItem, completed: false },
    ])
    setNewItem("")
  }

  function toggleTodo(id: string, completed: boolean) {
    setTodos(currentTodos => 
      currentTodos.map(todo => todo.id === id ? { ...todo, completed } : todo)
    )
  }

  function deleteTodo(id: string) {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id))
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            type="text"
            id="item"
            placeholder="What needs to be done?"
          />
        </div>
        <button className="btn">Add Task</button>
      </form>

      <h1 className="header">Todo List</h1>
      
      <ul className="list">
        {todos.length === 0 && <li className="empty-msg">No tasks yet!</li>}
        {todos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={e => toggleTodo(todo.id, e.target.checked)}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.5 : 1 }}>
                {todo.title}
              </span>
            </label>
            <button onClick={() => deleteTodo(todo.id)} className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}