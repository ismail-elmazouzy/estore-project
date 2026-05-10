import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get(`/cart/${user.id}`);
      setCart(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleRemove = async (itemId) => {
    // التحسين المضاف: تأكيد الحذف
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet article de votre panier ?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/cart/remove/${itemId}`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put('/cart/update', { cartItemId: itemId, quantity: newQty });
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const handleOrder = async () => {
    setOrdering(true);
    try {
      await api.post('/orders', { userId: user.id });
      navigate('/orders');
    } catch (err) {
      alert('Erreur lors de la commande');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mon Panier</h2>

      {cart?.items?.length === 0 ? (
        <div style={styles.empty}>
          <p>Votre panier est vide</p>
          <button onClick={() => navigate('/products')} style={styles.btnOrder}>
            Continuer les achats
          </button>
        </div>
      ) : (
        <div style={styles.layout}>
          <div style={styles.items}>
            {cart?.items?.map(item => (
              <div key={item.itemId} style={styles.item}>
                <div style={styles.itemImg}>
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} style={styles.img} /> : "🛍️"}
                </div>
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.productName}</div>
                  <div style={styles.itemPrice}>{item.unitPrice} $</div>
                  <div style={styles.itemSubtotal}>Total: {item.subtotal} $</div>
                </div>
                <div style={styles.qtyControl}>
                  <button onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                </div>
                <button onClick={() => handleRemove(item.itemId)} style={styles.btnDelete}>🗑️</button>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h3>Récapitulatif</h3>
            <div style={styles.row}><span>Total</span><span>{cart?.total} $</span></div>
            <button onClick={handleOrder} style={styles.btnOrder} disabled={ordering}>
              {ordering ? 'Traitement...' : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px' },
  title: { fontSize: '22px', marginBottom: '24px' },
  loading: { textAlign: 'center', padding: '60px' },
  empty: { textAlign: 'center', padding: '60px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' },
  items: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee' },
  itemImg: { width: '70px', height: '70px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%', objectFit: 'contain' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: '600' },
  itemPrice: { color: '#888', fontSize: '13px' },
  itemSubtotal: { color: '#1D9E75', fontWeight: '500' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: '30px', height: '30px', cursor: 'pointer' },
  btnDelete: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
  summary: { padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', height: 'fit-content' },
  row: { display: 'flex', justifyContent: 'space-between', margin: '15px 0', fontWeight: '700' },
  btnOrder: { width: '100%', padding: '12px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default CartPage;