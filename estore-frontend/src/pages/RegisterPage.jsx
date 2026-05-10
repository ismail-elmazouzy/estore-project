import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Créer un compte</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Prénom</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} style={styles.input} placeholder="Ahmed" required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nom</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} style={styles.input} placeholder="Ali" required />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Adresse Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="exemple@mail.com" required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="••••••" required />
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>

        <p style={styles.footer}>
          Déjà inscrit ? <Link to="/login" style={styles.footerLink}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

// التنسيقات مشابهة لصفحة الدخول
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { width: '400px', padding: '32px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  title: { textAlign: 'center', marginBottom: '24px', fontSize: '24px', color: '#333', fontWeight: 'bold' },
  formGroup: { marginBottom: '16px', flex: 1 },
  label: { display: 'block', fontSize: '14px', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { width: '100%', padding: '12px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' },
  error: { backgroundColor: '#FCEBEB', color: '#A32D2D', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' },
  footer: { textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' },
  footerLink: { color: '#1D9E75', textDecoration: 'none', fontWeight: '600' },
};

export default RegisterPage;