import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';
import { AnimatePresence } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    if (loading) {
      setProgress(0);
      let value = 0;
      const animate = () => {
        value += Math.random() * 18 + 6;
        if (value < 100) {
          setProgress(value);
          frame = setTimeout(animate, 180);
        } else {
          setProgress(100);
        }
      };
      animate();
    }
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => {
      clearTimeout(timer);
      clearTimeout(frame);
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <div
            key="loader"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'var(--bg-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
              flexDirection: 'column',
            }}
          >
            <Progress.Root
              value={progress}
              style={{
                position: 'relative',
                width: 220,
                height: 7,
                background: 'rgba(199,244,100,0.08)',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 2px 16px 0 rgba(199,244,100,0.10)',
                marginBottom: 18,
              }}
            >
              <Progress.Indicator
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--lime) 60%, #eaffb0 100%)',
                  borderRadius: 8,
                  transition: 'width 0.4s cubic-bezier(0.65,0,0.35,1)',
                  boxShadow: '0 0 8px 0 var(--lime)',
                }}
              />
            </Progress.Root>
          </div>
        ) : (
          <div
            key="main"
          >
            <Header onAuthOpen={() => setShowAuth(true)} />
            <AppRoutes onAuthOpen={() => setShowAuth(true)} />
            <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
            <ToastContainer position="bottom-right" autoClose={3200} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
