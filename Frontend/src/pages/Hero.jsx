import React from 'react';
import '../styles/Hero.css';
import { motion } from 'framer-motion';
import HeroBanner from '../assets/HeroBanner.svg';

const Hero = ({ onAuthOpen }) => {
  return (
    <div className="hero">
      <div className="hero-left">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.85, ease: 'easeOut' }}
          style={{ fontWeight: 700, fontSize: '3rem', marginBottom: '1.2rem', lineHeight: '1.1' }}
        >
          Manage <span className="accent">Money</span>. Build <span className="accent">Wealth</span>. Meet <span className="accent">FinBuddy</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.85, ease: 'easeOut' }}
          style={{ color: 'var(--text-gray)', fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: 520, lineHeight: 1.6 }}
        >
          Your personal finance companion to help you track, budget, and invest smartly.
        </motion.p>
        <motion.button
          className="hero-btn"
          onClick={onAuthOpen}
          initial={{
            borderLeft: '2px solid var(--lime)',
            borderBottom: '2px solid var(--lime)',
            borderTop: '0px solid var(--lime)',
            borderRight: '0px solid var(--lime)',
            borderRadius: '10px',
          }}
          whileHover={{
            scale: 1.06,
            borderLeft: '2px solid var(--lime)',
            borderBottom: '2px solid var(--lime)',
            borderTop: '2px solid var(--lime)',
            borderRight: '2px solid var(--lime)',
            borderRadius: '10px',
          }}
          transition={{ duration: 0.28, type: 'spring', bounce: 0.3 }}
        >
          Get Started
        </motion.button>
      </div>

      <motion.div
        className="hero-right"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.75, duration: 1.1, ease: 'easeOut' }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <img
          src={HeroBanner}
          alt="Finance Illustration"
          style={{ maxWidth: '90%', height: 'auto', borderRadius: '14px' }}
        />
      </motion.div>
    </div>
  );
};

export default Hero;
