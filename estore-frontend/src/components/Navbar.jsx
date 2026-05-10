import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // جلب بيانات المستخدم من التخزين المحلي
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      {/* عرض زر الإدارة فقط إذا كان المستخدم ADMIN */}
      {user && user.role === 'ADMIN' && (
        <Link to="/admin" style={styles.adminLink}>
          ⚙️ Administration
        </Link>
      )}

      {/* Logo */}
      <Link to="/products" style={styles.brand}>
        🛒 E-Store
      </Link>

      {/* Links */}
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Produits</Link>
        {user && <Link to="/cart" style={styles.link}>🛒 Panier</Link>}
        {user && <Link to="/orders" style={styles.link}>Mes commandes</Link>}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {user ? (
          <>
            <span style={styles.username}>👤 {user.firstName}</span>
            <button onClick={handleLogout} style={styles.btnLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.btn}>Connexion</Link>
            <Link to="/register" style={styles.btnPrimary}>S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 40px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  brand: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1D9E75',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '30px',
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  // تصميم مميز لزر الأدمن
  adminLink: {
    color: '#ffffff',
    backgroundColor: '#e11d48',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '20px',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  username: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  btn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '500',
  },
  btnPrimary: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1D9E75',
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  btnLogout: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default Navbar;