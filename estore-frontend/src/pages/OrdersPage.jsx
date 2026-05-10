import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/user/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':    return { bg: '#FAEEDA', color: '#854F0B', label: 'En attente' };
      case 'CONFIRMED':  return { bg: '#E1F5EE', color: '#0F6E56', label: 'Confirmée' };
      case 'SHIPPED':    return { bg: '#E6F1FB', color: '#185FA5', label: 'Expédiée' };
      case 'DELIVERED':  return { bg: '#EAF3DE', color: '#3B6D11', label: 'Livrée' };
      case 'CANCELLED':  return { bg: '#FCEBEB', color: '#A32D2D', label: 'Annulée' };
      default:           return { bg: '#f5f5f5', color: '#666',    label: status };
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mes Commandes</h2>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>Aucune commande pour l'instant</p>
          <button onClick={() => navigate('/products')} style={styles.btnPrimary}>
            Commencer mes achats
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(order => {
            const s = getStatusStyle(order.status);
            return (
              <div key={order.orderId} style={styles.card}>

                {/* Header */}
                <div style={styles.cardHeader}>
                  <div>
                    <div style={styles.orderId}>Commande #{order.orderId}</div>
                    <div style={styles.orderDate}>
                      {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </div>

                {/* Items */}
                <div style={styles.cardItems}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={styles.orderItem}>
                      <span>🛍️ {item.productName} × {item.quantity}</span>
                      <span style={styles.itemPrice}>{item.subtotal} $</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={styles.cardFooter}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalAmount}>{order.totalAmount} $</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px' },
  title: { fontSize: '22px', fontWeight: '500', color: '#333', marginBottom: '24px' },
  loading: { textAlign: 'center', padding: '60px', color: '#888' },
  empty: { textAlign: 'center', padding: '60px', color: '#888', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  orderId: { fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '4px' },
  orderDate: { fontSize: '13px', color: '#888' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  cardItems: { borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '12px 0', marginBottom: '12px' },
  orderItem: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555', padding: '4px 0' },
  itemPrice: { color: '#333', fontWeight: '500' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: '15px', color: '#666' },
  totalAmount: { fontSize: '18px', fontWeight: '600', color: '#1D9E75' },
  btnPrimary: { padding: '10px 20px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};

export default OrdersPage;