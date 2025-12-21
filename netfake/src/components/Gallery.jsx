import React, { useState, useEffect } from 'react';
import api from '../api';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  
  // Estados para ADICIONAR nova foto
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");

  // --- NOVOS ESTADOS PARA EDITAR (UPDATE) ---
  const [editingId, setEditingId] = useState(null); // Qual foto estou editando?
  const [editUrl, setEditUrl] = useState("");       // URL temporária
  const [editTitle, setEditTitle] = useState("");   // Título temporário

  useEffect(() => { loadPhotos(); }, []);

  async function loadPhotos() {
    // Pega as fotos (limitando para não travar se tiverem muitas)
    const res = await api.get('/photos?_limit=20');
    // Inverte para as novas aparecerem primeiro
    setPhotos(res.data.reverse());
  }

  async function addPhoto() {
    if (!newUrl) return alert("Cole o link da imagem!");
    
    await api.post('/photos', {
      id: String(Date.now()),
      albumId: 1,
      title: newTitle || "Sem título", // Se não tiver título, coloca um padrão
      url: newUrl,
      thumbnailUrl: newUrl
    });
    
    setNewUrl("");
    setNewTitle("");
    loadPhotos();
  }

  async function deletePhoto(id) {
    if (confirm("Tem certeza que deseja apagar esta imagem?")) {
      await api.delete(`/photos/${id}`);
      loadPhotos();
    }
  }

  // --- FUNÇÕES DE EDIÇÃO ---
  function startEditing(photo) {
    setEditingId(photo.id);   // Entra no modo edição
    setEditUrl(photo.url);    // Puxa a URL atual
    setEditTitle(photo.title);// Puxa o título atual
  }

  function cancelEditing() {
    setEditingId(null);
    setEditUrl("");
    setEditTitle("");
  }

  async function saveEdit(id) {
    if (!editUrl) return alert("A imagem precisa de um link!");

    // Atualiza a URL e o Título
    await api.patch(`/photos/${id}`, {
      title: editTitle,
      url: editUrl,
      thumbnailUrl: editUrl
    });

    setEditingId(null); // Sai do modo edição
    loadPhotos();       // Atualiza a tela
  }

  return (
    <div className="container">
      <h2>Galeria de Pôsteres</h2>

      {/* --- FORMULÁRIO DE ADICIONAR --- */}
      <div className="form-box">
        <input 
          placeholder="Cole o Link da Imagem (URL)..." 
          value={newUrl} 
          onChange={e => setNewUrl(e.target.value)} 
        />
        <input 
          placeholder="Título do Filme/Série (Opcional)..." 
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)} 
        />
        <button className="btn-primary" onClick={addPhoto}>Adicionar à Galeria</button>
      </div>

      {/* --- GRID DE FOTOS --- */}
      <div className="card-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="card" style={{ padding: '10px' }}>
            
            {/* LÓGICA: MODO EDIÇÃO vs MODO VISUALIZAÇÃO */}
            {editingId === photo.id ? (
              // === MODO EDIÇÃO (Inputs) ===
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{color: '#aaa', fontSize: '12px'}}>Editar Link:</label>
                <input 
                  value={editUrl} 
                  onChange={e => setEditUrl(e.target.value)}
                  style={{fontSize: '12px'}}
                />
                
                <label style={{color: '#aaa', fontSize: '12px'}}>Editar Título:</label>
                <input 
                  value={editTitle} 
                  onChange={e => setEditTitle(e.target.value)}
                  style={{fontSize: '12px'}}
                />

                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    className="btn-primary" 
                    style={{ background: '#46d369', flex: 1, padding: '5px' }}
                    onClick={() => saveEdit(photo.id)}
                  >
                    Salvar
                  </button>
                  <button 
                    className="btn-delete" 
                    style={{ marginTop: 0, flex: 1, padding: '5px' }}
                    onClick={cancelEditing}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // === MODO VISUALIZAÇÃO (Imagem) ===
              <>
                <div style={{ height: '300px', overflow: 'hidden', borderRadius: '5px', marginBottom: '10px' }}>
                  <img 
                    src={photo.url} 
                    alt="poster" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://placehold.co/400x600/333/FFF?text=Erro+no+Link"; 
                    }}
                  />
                </div>

                <h4 style={{ margin: '10px 0', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {photo.title}
                </h4>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => startEditing(photo)}
                    style={{
                       background: '#f5c518', 
                       color: 'black', 
                       border: 'none', 
                       padding: '5px 10px', 
                       borderRadius: 4, 
                       cursor: 'pointer', 
                       fontWeight: 'bold',
                       fontSize: '0.8rem'
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-delete" 
                    style={{ marginTop: 0, padding: '5px 10px', fontSize: '0.8rem' }}
                    onClick={() => deletePhoto(photo.id)}
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

export default Gallery;