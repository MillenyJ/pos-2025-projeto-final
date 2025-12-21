import React, { useState, useEffect } from 'react';
import api from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");

  // --- NOVOS ESTADOS PARA A EDIÇÃO ---
  const [editingId, setEditingId] = useState(null); // Qual usuário estou editando agora?
  const [editName, setEditName] = useState("");     // O novo nome enquanto digito

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    const res = await api.get('/users');
    setUsers(res.data);
  }

  async function addUser() {
    if (!newName) return;
    await api.post('/users', {
      id: String(Date.now()),
      name: newName,
      email: "cliente@netfake.com" 
    });
    setNewName("");
    loadUsers();
  }

  async function deleteUser(id) {
    if (confirm("Tem certeza que deseja excluir?")) {
      await api.delete(`/users/${id}`);
      loadUsers();
    }
  }

  // --- FUNÇÕES DE EDITAR (UPDATE) ---
  function startEditing(user) {
    setEditingId(user.id);   // Marca este card como "em edição"
    setEditName(user.name);  // Puxa o nome atual para o input
  }

  function cancelEditing() {
    setEditingId(null); // Cancela a edição
    setEditName("");
  }

  async function saveEdit(id) {
    if(!editName) return;
    // O VERBO 'PATCH' ou 'PUT' SERVE PARA EDITAR
    await api.patch(`/users/${id}`, { name: editName });
    
    setEditingId(null); // Sai do modo edição
    loadUsers();        // Atualiza a tela
  }

  return (
    <div className="container">
      <h2>Gerenciar Perfis (Users)</h2>

      {/* Formulário de Adicionar */}
      <div className="form-box">
        <div className="form-group">
          <input 
            placeholder="Nome do novo perfil..." 
            value={newName} 
            onChange={e => setNewName(e.target.value)} 
          />
          <button className="btn-primary" onClick={addUser}>Criar Perfil</button>
        </div>
      </div>

      {/* Lista de Perfis */}
      <div className="card-grid">
        {users.map((user) => (
          <div key={user.id} className="card" style={{ textAlign: 'center' }}>
            <img 
              src={`https://robohash.org/${user.name}?set=set4`} 
              alt="avatar" 
              style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 10, background: '#444' }}
            />
            
            {/* LÓGICA MÁGICA: Se este for o card editado, mostra input. Se não, mostra texto. */}
            {editingId === user.id ? (
              <div style={{background: '#444', padding: 10, borderRadius: 5}}>
                <input 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                  style={{marginBottom: 5, textAlign: 'center'}} 
                />
                <div style={{display: 'flex', gap: 5, justifyContent: 'center'}}>
                  <button 
                    className="btn-primary" 
                    style={{padding: '5px 10px', fontSize: '0.8rem', background: '#46d369'}} 
                    onClick={() => saveEdit(user.id)}
                  >
                    Salvar
                  </button>
                  <button 
                    className="btn-delete" 
                    style={{margin: 0, padding: '5px 10px', fontSize: '0.8rem'}} 
                    onClick={cancelEditing}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>{user.name}</h3>
                <p style={{fontSize: '0.8rem', color: '#aaa'}}>{user.email}</p>
                
                <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 15}}>
                   {/* BOTÃO EDITAR AMARELO */}
                   <button 
                     onClick={() => startEditing(user)}
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
                   
                   <button className="btn-delete" style={{marginTop: 0}} onClick={() => deleteUser(user.id)}>Excluir</button>
                </div>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;