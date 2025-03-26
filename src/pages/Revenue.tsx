
import React from 'react';
import { RevenueManagement } from '../components/RevenueManagement';
import Navbar from '../components/Navbar';

const RevenuePage = () => {
  return (
    <div className="min-h-screen bg-financial-background">
      <Navbar />
      <RevenueManagement />
    </div>
  );
};

export default RevenuePage;
