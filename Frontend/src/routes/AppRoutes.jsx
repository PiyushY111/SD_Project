import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Goals from '../pages/Goals';
import Expenses from '../pages/Expenses';
import Earnings from '../pages/Earnings';
import Recurring from '../pages/Recurring';
import Hero from '../pages/Hero';
// import NotFound from '../pages/NotFound'; // Remove this line

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Hero />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/goals" element={<Goals />} />
    <Route path="/expenses" element={<Expenses />} />
    <Route path="/earnings" element={<Earnings />} />
    <Route path="/recurring" element={<Recurring />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
