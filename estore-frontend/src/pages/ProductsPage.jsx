import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState({});
  const [hoveredId, setHoveredId] = useState(null); // لتتبع العنصر الذي تمر عليه الفأرة

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) { fetchProducts(); return; }
    try {
      const res = await api.get(`/products?search=${search}`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddToCart = async (productId) => {
    if (!user) { navigate('/login'); return; }
    setAddedItems(prev => ({ ...prev, [productId]: 'loading' }));
    try {
      await api.post('/cart/add', {
        userId: user.id,
        productId: productId,
        quantity: 1,
      });
      setAddedItems(prev => ({ ...prev, [productId]: 'added' }));
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [productId]: null }));
      }, 2000);
    } catch (err) {
      setAddedItems(prev => ({ ...prev, [productId]: 'error' }));
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [productId]: null }));
      }, 2000);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryName === selectedCategory);

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.btnSearch}>
          Rechercher
        </button>
      </div>

      {/* Categories */}
      <div style={styles.tabBar}>
        <button
          style={selectedCategory === 'all' ? styles.tabActive : styles.tab}
          onClick={() => setSelectedCategory('all')}>
          Tous
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            style={selectedCategory === cat.name ? styles.tabActive : styles.tab}
            onClick={() => setSelectedCategory(cat.name)}>
            {cat.name}
          </button>
        ))}
      </div>

      <h2 style={styles.sectionTitle}>
        {filteredProducts.length} produit(s) disponible(s)
      </h2>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div style={styles.empty}>Aucun produit trouvé</div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map(product => {
            const status = addedItems[product.id];
            const outOfStock = product.stockQuantity === 0;
            const isHovered = hoveredId === product.id;

            const btnColor =
              status === 'added' ? '#0F6E56' :
              status === 'error' ? '#D85A30' :
              outOfStock        ? '#ccc'    : '#1D9E75';

            return (
              <div 
                key={product.id} 
                style={{
                  ...styles.card,
                  transform: isHovered ? 'translateY(-8px)' : 'none',
                  boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
                  borderColor: isHovered ? '#1D9E75' : '#e0e0e0',
                }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={styles.productImgContainer}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      ...styles.productImg,
                      filter: outOfStock ? 'grayscale(100%)' : 'none',
                      opacity: outOfStock ? 0.6 : 1
                    }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'; }}
                  />
                </div>
                <div style={styles.productName}>{product.name}</div>
                <div style={styles.productCat}>{product.categoryName}</div>
                <div style={styles.productDesc}>{product.description}</div>
                <div style={styles.productPrice}>{product.price} $</div>
                <div style={styles.stock}>
                  {outOfStock
                    ? '❌ Rupture de stock'
                    : `✅ En stock (${product.stockQuantity})`}
                </div>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={outOfStock || status === 'loading'}
                  style={{
                    ...styles.btnCart,
                    backgroundColor: btnColor,
                    cursor: outOfStock ? 'not-allowed' : 'pointer',
                  }}>
                  {status === 'loading' ? '⏳...' : status === 'added' ? '✓' : '🛒 Ajouter'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px' },
  loading: { textAlign: 'center', padding: '60px' },
  empty: { textAlign: 'center', padding: '60px' },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  btnSearch: { padding: '10px 20px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  tabBar: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: { padding: '7px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer' },
  tabActive: { padding: '7px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#1D9E75', color: 'white', cursor: 'pointer' },
  sectionTitle: { fontSize: '16px', fontWeight: '500', marginBottom: '16px' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
    gap: '24px' 
  },
  card: { 
    backgroundColor: 'white', 
    border: '1px solid #e0e0e0', 
    borderRadius: '16px', 
    padding: '18px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    cursor: 'pointer'
  },
  productImgContainer: { width: '100%', height: '180px', backgroundColor: '#f9f9f9', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  productImg: { width: '100%', height: '100%', objectFit: 'contain', transition: 'filter 0.3s ease' },
  productName: { fontSize: '16px', fontWeight: '600' },
  productCat: { fontSize: '11px', color: '#1D9E75', backgroundColor: '#E1F5EE', padding: '3px 10px', borderRadius: '20px', width: 'fit-content' },
  productDesc: { fontSize: '13px', color: '#777', height: '36px', overflow: 'hidden' },
  productPrice: { fontSize: '19px', fontWeight: '700', color: '#1D9E75' },
  stock: { fontSize: '12px', color: '#999' },
  btnCart: { padding: '12px', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', transition: 'background 0.3s' },
};

export default ProductsPage;