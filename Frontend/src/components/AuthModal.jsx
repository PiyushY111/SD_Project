import React, { useState } from 'react';
import '../styles/AuthModal.css';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ show, onClose }) => {
  const [mode, setMode] = useState('login'); // or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      // Signup API call
      try {
        const res = await fetch('https://capstone2-km5z.onrender.com/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
        });
        const data = await res.json();
        if (res.ok) {
          setToast({ message: 'Signup successful!', type: 'success' });
          setTimeout(() => setToast(null), 3500);
          setTimeout(() => onClose(), 1200);
        } else {
          setToast({ message: data.message || 'Signup failed', type: 'error' });
          setTimeout(() => setToast(null), 3500);
        }
      } catch {
        setToast({ message: 'Network error', type: 'error' });
        setTimeout(() => setToast(null), 3500);
      }
      return;
    }
    // Login mode: connect to backend
    try {
      const res = await fetch('https://capstone2-km5z.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: 'Login successful!', type: 'success' });
        // Store user info in localStorage for authentication
        localStorage.setItem('user', JSON.stringify(data));
        setTimeout(() => setToast(null), 3500);
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 1200);
      } else {
        setToast({ message: data.message || 'Login failed', type: 'error' });
        setTimeout(() => setToast(null), 3500);
      }
    } catch {
      setToast({ message: 'Network error', type: 'error' });
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={mode} // Use mode as a unique key for the modal
          className="auth-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 2000 }}
        >
          <motion.div
            className="auth-modal"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{
              minWidth: 370,
              maxWidth: 420,
              width: '90%',
              background: 'var(--bg-dark)',
              borderRadius: 18,
              boxShadow: '0 8px 40px rgba(80,184,231,0.10)',
              border: '1.5px solid rgba(199,244,100,0.10)',
              padding: '2.5rem 2rem 2rem 2rem',
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer', zIndex: 2 }}>&times;</button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2.2rem', gap: '1.2rem' }}>
              <button
                className={mode === 'login' ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
                onClick={() => setMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: mode === 'login' ? 'var(--lime)' : 'var(--text-gray)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '0.3rem 1.2rem',
                  borderBottom: mode === 'login' ? '2.5px solid var(--lime)' : '2.5px solid transparent',
                  cursor: 'pointer',
                  borderRadius: 0,
                  transition: 'color 0.2s, border-bottom 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <FaSignInAlt style={{ fontSize: '1.1em', marginBottom: '-2px' }} /> Login
              </button>
              <button
                className={mode === 'signup' ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
                onClick={() => setMode('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: mode === 'signup' ? 'var(--lime)' : 'var(--text-gray)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '0.3rem 1.2rem',
                  borderBottom: mode === 'signup' ? '2.5px solid var(--lime)' : '2.5px solid transparent',
                  cursor: 'pointer',
                  borderRadius: 0,
                  transition: 'color 0.2s, border-bottom 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <FaUserPlus style={{ fontSize: '1.1em', marginBottom: '-2px' }} /> Signup
              </button>
            </div>
            <AnimatePresence mode="wait">
              {mode === 'signup' ? (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
                >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit" className="submit-btn">
                    Create Account
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
                >
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="submit-btn">
                    Login
              </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            minWidth: 220,
            background: 'rgba(20,20,20,0.98)',
            color: toast.type === 'success' ? 'var(--lime)' : '#ff4d4f',
            border: `1.5px solid ${toast.type === 'success' ? 'var(--lime)' : '#ff4d4f'}`,
            borderRadius: 10,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: '1rem 1.5rem 1.2rem 1.5rem',
            zIndex: 3000,
            fontWeight: 600,
            fontSize: '1.05rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <span>{toast.message}</span>
          <div style={{ width: '100%', height: 4, background: 'rgba(199,244,100,0.10)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: toast.type === 'success' ? 'var(--lime)' : '#ff4d4f',
                animation: 'toast-progress 3.2s linear',
              }}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

<style>{`
@keyframes toast-progress {
  from { width: 100%; }
  to { width: 0%; }
}
`}</style>
