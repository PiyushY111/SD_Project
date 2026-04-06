import React, { useState } from 'react';
import '../styles/Header.css';
import Logo from '../assets/Logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../utils/auth';
import { motion } from 'framer-motion';

const Header = ({ onAuthOpen }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('user');
  const isHeroPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    navigate('/');
  };

  return (
    <header className="header">
      <motion.div
        className="logo"
        whileHover={{ scale: 1.05, rotate: -1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img src={Logo} alt="FinBuddy Logo" className="logo-img" />
        <span className="logo-text">FinBuddy</span>
      </motion.div>

      {isAuthenticated && !isHeroPage && (
        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/earnings">Earnings</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/goals">Goals</Link>
          <Link to="/recurring">Recurring</Link>
        </nav>
      )}

      {isHeroPage ? (
        <button className="login-btn" onClick={onAuthOpen}>
          Login / Signup
        </button>
      ) : (
        isAuthenticated && (
          <>
            <button className="logout-btn" onClick={() => setShowConfirm(true)}>
              <FaSignOutAlt /> Logout
            </button>

            {showConfirm && (
              <motion.div
                className="logout-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="logout-modal"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <h2>Are you sure you want to logout?</h2>
                  <div className="modal-buttons">
                    <button className="confirm-logout" onClick={handleLogout}>
                      Logout
                    </button>
                    <button className="cancel-logout" onClick={() => setShowConfirm(false)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )
      )}
    </header>
  );
};

export default Header;
