import React, { useState, useEffect } from 'react';
import api from '../api';

function Reviews() {
  const [posts, setPosts] = useState([]);
  
  // Estados para CRIAR um novo post
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  // --- NOVOS ESTADOS PARA EDITAR (UPDATE) ---
  const [editingId, setEditingId] = useState(null); // Qual post estou editando?
  const [editTitle, setEditTitle] = useState("");   // Título temporário
  const [editBody, setEditBody] = useState("");     // Texto temporário

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    // Busca os posts mais recentes primeiro (inverte a ordem)
    const res = await api.get('/posts');
    setPosts(res.data.reverse());
  }

  async function addPost() {
    if (!newTitle || !newBody) return alert("Preencha título e comentário!");
    
    await api.post('/posts', {
      id: String(Date.now()),
      title: newTitle,
      body: newBody,
      userId: 1 // Simulando que foi o usuário 1 que escreveu
    });
    
    setNewTitle("");
    setNewBody("");
    loadPosts();
  }

  async function deletePost(id) {
    if (confirm("Apagar esta crítica?")) {
      await api.delete(`/posts/${id}`);
      loadPosts();
    }
  }

  // --- FUNÇÕES DE EDIÇÃO ---
  function startEditing(post) {
    setEditingId(post.id);   // Entra no modo edição deste post
    setEditTitle(post.title); // Puxa o texto atual para o input
    setEditBody(post.body);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  }

  async function saveEdit(id) {
    if (!editTitle || !editBody) return alert("Não deixe em branco!");

    // O PATCH atualiza só o que mudou (título e corpo)
    await api.patch(`/posts/${id}`, {
      title: editTitle,
      body: editBody
    });

    setEditingId(null); // Sai do modo edição
    loadPosts();        // Atualiza a tela
  }

  return (
    <div className="container">
      <h2>Mural de Críticas</h2>

      {/* --- FORMULÁRIO DE CRIAR (CREATE) --- */}
      <div className="form-box">
        <h3>Deixe sua opinião</h3>
        <input 
          placeholder="Filme/Série (Título)" 
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)} 
        />
        <textarea 
          placeholder="O que você achou? (Escreva sua crítica)" 
          value={newBody} 
          onChange={e => setNewBody(e.target.value)}
          rows="3"
        />
        <button className="btn-primary" onClick={addPost}>Publicar Crítica</button>
      </div>

      {/* --- LISTA DE POSTS (READ / UPDATE / DELETE) --- */}
      <div className="reviews-list">
        {posts.map((post) => (
          <div key={post.id} className="card" style={{ marginBottom: '20px', textAlign: 'left' }}>
            
            {/* LÓGICA DE TROCA: MODO EDIÇÃO vs MODO LEITURA */}
            {editingId === post.id ? (
              // === MODO EDIÇÃO (Inputs) ===
              <div style={{ background: '#333', padding: '10px', borderRadius: '5px' }}>
                <label style={{color: '#aaa', fontSize: '12px'}}>Editando Título:</label>
                <input 
                  value={editTitle} 
                  onChange={e => setEditTitle(e.target.value)}
                  style={{ background: '#222', border: '1px solid #555' }}
                />
                
                <label style={{color: '#aaa', fontSize: '12px'}}>Editando Texto:</label>
                <textarea 
                  value={editBody} 
                  onChange={e => setEditBody(e.target.value)}
                  rows="4"
                  style={{ background: '#222', border: '1px solid #555' }}
                />

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    className="btn-primary" 
                    style={{ background: '#46d369', width: 'auto' }}
                    onClick={() => saveEdit(post.id)}
                  >
                    Salvar Alterações
                  </button>
                  <button 
                    className="btn-delete" 
                    style={{ marginTop: 0, width: 'auto' }}
                    onClick={cancelEditing}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

            ) : (
              // === MODO LEITURA (Texto Normal) ===
              <>
                <h3 style={{ color: '#E50914', marginTop: 0 }}>{post.title}</h3>
                <p style={{ color: '#ccc', lineHeight: '1.5' }}>{post.body}</p>
                
                <div style={{ borderTop: '1px solid #444', paddingTop: '10px', marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    onClick={() => startEditing(post)}
                    style={{
                       background: '#f5c518', 
                       color: 'black', 
                       border: 'none', 
                       padding: '5px 15px', 
                       borderRadius: 4, 
                       cursor: 'pointer', 
                       fontWeight: 'bold'
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-delete" 
                    style={{ marginTop: 0 }} 
                    onClick={() => deletePost(post.id)}
                  >
                    Excluir
                  </button>
                </div>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;