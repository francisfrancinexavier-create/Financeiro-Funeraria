
import React from 'react';
import { Reports as ReportsComponent } from '../components/Reports';
import Navbar from '../components/Navbar';

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-financial-background">
      <Navbar />
      <ReportsComponent />
    </div>
  );
};

export default ReportsPage;
