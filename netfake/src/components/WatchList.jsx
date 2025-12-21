import React, { useState, useEffect } from 'react';
import api from '../api';

function WatchList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // --- NOVOS ESTADOS PARA EDITAR (UPDATE) ---
  const [editingId, setEditingId] = useState(null); // Qual item estou a editar?
  const [editTitle, setEditTitle] = useState("");   // O novo texto

  useEffect(() => { loadTodos(); }, []);

  async function loadTodos() {
    const res = await api.get('/todos');
    setTodos(res.data.reverse());
  }

  async function addTodo() {
    if (!newTodo) return;
    await api.post('/todos', {
      id: String(Date.now()),
      title: newTodo,
      completed: false,
      userId: 1
    });
    setNewTodo("");
    loadTodos();
  }

  async function deleteTodo(id) {
    await api.delete(`/todos/${id}`);
    loadTodos();
  }

  async function toggleCompleted(todo) {
    // Atualiza apenas o status de "completado"
    await api.patch(`/todos/${todo.id}`, {
      completed: !todo.completed
    });
    loadTodos();
  }

  // --- FUNÇÕES DE EDIÇÃO ---
  function startEditing(todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
  }

  async function saveEdit(id) {
    if (!editTitle) return;

    // Atualiza apenas o Título (mantém o status de completado igual)
    await api.patch(`/todos/${id}`, {
      title: editTitle
    });

    setEditingId(null);
    loadTodos();
  }

  return (
    <div className="container">
      <h2>Minha Lista para Assistir</h2>

      {/* Input de Adicionar */}
      <div className="form-box">
        <input 
          placeholder="Nome do filme ou série..." 
          value={newTodo} 
          onChange={e => setNewTodo(e.target.value)} 
        />
        <button className="btn-primary" onClick={addTodo}>Adicionar à Lista</button>
      </div>

      {/* Lista de Tarefas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {todos.map((todo) => (
          <div key={todo.id} className="card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '15px',
            background: todo.completed ? '#1f1f1f' : '#2f2f2f', // Fica mais escuro se já assistiu
            opacity: todo.completed ? 0.6 : 1
          }}>

            {/* LÓGICA: MODO EDIÇÃO vs MODO VISUALIZAÇÃO */}
            {editingId === todo.id ? (
              // === MODO EDIÇÃO ===
              <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                <input 
                  value={editTitle} 
                  onChange={e => setEditTitle(e.target.value)}
                  autoFocus
                  style={{ flex: 1, marginBottom: 0 }}
                />
                <button 
                  className="btn-primary" 
                  style={{ width: 'auto', background: '#46d369' }}
                  onClick={() => saveEdit(todo.id)}
                >
                  Salvar
                </button>
                <button 
                  className="btn-delete" 
                  style={{ width: 'auto', margin: 0 }}
                  onClick={cancelEditing}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              // === MODO VISUALIZAÇÃO ===
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => toggleCompleted(todo)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', margin: 0 }}
                  />
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#777' : 'white',
                    fontSize: '1.1rem'
                  }}>
                    {todo.title}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                   <button 
                     onClick={() => startEditing(todo)}
                     style={{
                       background: '#f5c518', 
                       color: 'black', 
                       border: 'none', 
                       padding: '5px 10px', 
                       borderRadius: 4, 
                       cursor: 'pointer', 
                       fontWeight: 'bold'
                     }}
                   >
                     Editar
                   </button>
                   <button 
                     className="btn-delete" 
                     style={{ margin: 0, padding: '5px 10px' }}
                     onClick={() => deleteTodo(todo.id)}
                   >
                     X
                   </button>
                </div>
              </>
            )}

          </div>
        ))}

        {todos.length === 0 && <p style={{textAlign: 'center', color: '#666'}}>Sua lista está vazia.</p>}
      </div>
    </div>
  );
}

export default WatchList;