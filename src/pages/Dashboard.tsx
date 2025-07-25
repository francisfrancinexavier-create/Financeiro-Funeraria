import React from 'react';
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-financial-background">
      {/* Renderiza Navbar e DashboardComponent */}
      <Navbar />
      <DashboardComponent />
    </div>
  );
};

export default DashboardPage;
