import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function AdminPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    imageUrl: '', categoryId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setShowAddForm(false);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl || '',
      categoryId: categories.find(c => c.name === product.categoryName)?.id || '',
    });
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowAddForm(true);
    setForm({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSave = async (productId) => {
    try {
      await api.put(`/products/${productId}`, {
        ...form,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
      });
      showMessage('✓ Produit mis à jour avec succès');
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      showMessage('✗ Erreur lors de la mise à jour');
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/products', {
        ...form,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
      });
      showMessage('✓ Produit ajouté avec succès');
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      showMessage('✗ Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${productId}`);
      showMessage('✓ Produit supprimé');
      fetchData();
    } catch (err) {
      showMessage('✗ Erreur lors de la suppression');
    }
  };

  const handleStock = async (productId, quantity) => {
    try {
      await api.put(`/inventory/${productId}?quantity=${quantity}`);
      showMessage('✓ Stock mis à jour');
      fetchData();
    } catch (err) {
      showMessage('✗ Erreur stock');
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>🛠️ Panneau Admin</h2>
        <div style={styles.headerActions}>
          <button onClick={handleAdd} style={styles.btnAdd}>
            ➕ Ajouter un produit
          </button>
          <button onClick={() => navigate('/products')} style={styles.btnBack}>
            ← Retour au site
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          ...styles.toast,
          backgroundColor: message.startsWith('✓') ? '#1D9E75' : '#D85A30'
        }}>
          {message}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ Nouveau Produit</h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nom</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Nom du produit"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Prix ($)</label>
              <input
                style={styles.input}
                type="number"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Catégorie</label>
              <select
                style={styles.input}
                value={form.categoryId}
                onChange={e => setForm({...form, categoryId: e.target.value})}>
                <option value="">Choisir...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>URL Image</label>
              <input
                style={styles.input}
                value={form.imageUrl}
                onChange={e => setForm({...form, imageUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{...styles.input, height: '80px', resize: 'vertical'}}
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Description du produit..."
              />
            </div>
          </div>
          {form.imageUrl && (
            <div style={styles.previewContainer}>
              <label style={styles.label}>Aperçu image:</label>
              <img
                src={form.imageUrl}
                alt="preview"
                style={styles.previewImg}
                onError={e => e.target.style.display = 'none'}
              />
            </div>
          )}
          <div style={styles.formActions}>
            <button onClick={handleCreate} style={styles.btnSave}>
              ✓ Créer le produit
            </button>
            <button onClick={handleCancel} style={styles.btnCancel}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={styles.tableContainer}>
        {products.map(product => (
          <div key={product.id} style={styles.productRow}>

            {editingProduct === product.id ? (
              /* Edit Mode */
              <div style={styles.editForm}>
                <div style={styles.editGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nom</label>
                    <input
                      style={styles.input}
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Prix ($)</label>
                    <input
                      style={styles.input}
                      type="number"
                      value={form.price}
                      onChange={e => setForm({...form, price: e.target.value})}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Catégorie</label>
                    <select
                      style={styles.input}
                      value={form.categoryId}
                      onChange={e => setForm({...form, categoryId: e.target.value})}>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>🖼️ URL Image</label>
                    <input
                      style={styles.input}
                      value={form.imageUrl}
                      onChange={e => setForm({...form, imageUrl: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      style={{...styles.input, height: '70px', resize: 'vertical'}}
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {form.imageUrl && (
                  <div style={styles.previewContainer}>
                    <label style={styles.label}>Aperçu:</label>
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      style={styles.previewImg}
                      onError={e => e.target.style.display = 'none'}
                    />
                  </div>
                )}

                <div style={styles.formActions}>
                  <button
                    onClick={() => handleSave(product.id)}
                    style={styles.btnSave}>
                    ✓ Enregistrer
                  </button>
                  <button onClick={handleCancel} style={styles.btnCancel}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div style={styles.productInfo}>
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/80'}
                  alt={product.name}
                  style={styles.productImg}
                  onError={e => e.target.src = 'https://via.placeholder.com/80'}
                />
                <div style={styles.productDetails}>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productMeta}>
                    <span style={styles.badge}>{product.categoryName}</span>
                    <span style={styles.price}>{product.price} $</span>
                    <span style={styles.stock}>
                      Stock: {product.stockQuantity}
                    </span>
                  </div>
                  <div style={styles.productDesc}>{product.description}</div>
                </div>
                <div style={styles.productActions}>
                  {/* Stock Control */}
                  <div style={styles.stockControl}>
                    <label style={styles.label}>Stock:</label>
                    <div style={styles.stockRow}>
                      <input
                        type="number"
                        defaultValue={product.stockQuantity}
                        id={`stock-${product.id}`}
                        style={styles.stockInput}
                        min="0"
                      />
                      <button
                        onClick={() => {
                          const val = document.getElementById(`stock-${product.id}`).value;
                          handleStock(product.id, parseInt(val));
                        }}
                        style={styles.btnStock}>
                        ✓
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(product)}
                    style={styles.btnEdit}>
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={styles.btnDelete}>
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px' },
  loading: { textAlign: 'center', padding: '60px', color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '600', color: '#333' },
  headerActions: { display: 'flex', gap: '10px' },
  toast: { position: 'fixed', top: '80px', right: '24px', color: 'white', padding: '12px 20px', borderRadius: '8px', zIndex: 999, fontSize: '14px' },
  formCard: { backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', marginBottom: '24px' },
  formTitle: { fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '16px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  editGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', color: '#666', fontWeight: '500' },
  input: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  previewContainer: { marginBottom: '12px' },
  previewImg: { width: '120px', height: '100px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #eee', marginTop: '6px' },
  formActions: { display: 'flex', gap: '10px' },
  tableContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  productRow: { backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px' },
  productInfo: { display: 'flex', alignItems: 'flex-start', gap: '16px' },
  productImg: { width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#f5f5f5', padding: '4px' },
  productDetails: { flex: 1 },
  productName: { fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '6px' },
  productMeta: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' },
  badge: { fontSize: '12px', color: '#1D9E75', backgroundColor: '#E1F5EE', padding: '2px 8px', borderRadius: '20px' },
  price: { fontSize: '14px', fontWeight: '600', color: '#1D9E75' },
  stock: { fontSize: '13px', color: '#888' },
  productDesc: { fontSize: '13px', color: '#777' },
  productActions: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' },
  stockControl: { display: 'flex', flexDirection: 'column', gap: '4px' },
  stockRow: { display: 'flex', gap: '6px' },
  stockInput: { width: '70px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'center' },
  btnStock: { padding: '6px 10px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  btnEdit: { padding: '7px 14px', backgroundColor: 'white', color: '#185FA5', border: '1px solid #185FA5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  btnDelete: { padding: '7px 14px', backgroundColor: 'white', color: '#D85A30', border: '1px solid #D85A30', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  btnAdd: { padding: '9px 18px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  btnBack: { padding: '9px 18px', backgroundColor: 'white', color: '#555', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  btnSave: { padding: '9px 18px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  btnCancel: { padding: '9px 18px', backgroundColor: 'white', color: '#555', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  editForm: { width: '100%' },
};

export default AdminPage;