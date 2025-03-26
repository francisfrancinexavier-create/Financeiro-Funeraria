
import React from 'react';
import { ExpenseManagement } from '../components/ExpenseManagement';
import Navbar from '../components/Navbar';

const ExpensesPage = () => {
  return (
    <div className="min-h-screen bg-financial-background">
      <Navbar />
      <ExpenseManagement />
    </div>
  );
};

export default ExpensesPage;
