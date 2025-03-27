import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Check, Calendar, Filter, Download, MoreHorizontal, CreditCard, Building, Truck, Briefcase, Users, ShoppingCart, Power, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExpenseData {
  id: string;
  description: string;
  category: string;
  icon: React.ElementType;
  value: string;
  due_date: string;
  is_paid: boolean;
}

const expenseCategories = [
  { name: 'Instalações', icon: Building },
  { name: 'Pessoal', icon: Users },
  { name: 'Fornecedores', icon: ShoppingCart },
  { name: 'Transportes', icon: Truck },
  { name: 'Administrativo', icon: Briefcase },
  { name: 'Utilidades', icon: Power },
  { name: 'Financeiro', icon: CreditCard },
];

const getCategoryIcon = (categoryName: string): React.ElementType => {
  const category = expenseCategories.find(cat => cat.name === categoryName);
  return category?.icon || Building;
};

export const ExpenseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [expensesData, setExpensesData] = useState<ExpenseData[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    value: '',
    dueDate: '',
    isPaid: false,
  });

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('expenses').select('*');
      
      if (selectedStatus !== null) {
        query = query.eq('is_paid', selectedStatus);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedData = data.map(item => ({
        id: item.id,
        description: item.description,
        category: item.category,
        icon: getCategoryIcon(item.category),
        value: formatCurrency(item.value),
        due_date: formatDate(item.due_date),
        is_paid: item.is_paid
      }));
      
      setExpensesData(formattedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Erro ao carregar despesas",
        description: "Não foi possível carregar as despesas. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedStatus]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const parseCurrency = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace('R$ ', '').replace(',', '.'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('expense-', '')]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isPaid: e.target.checked,
    }));
  };

  const filteredExpenses = expensesData.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleSaveExpense = async () => {
    if (!formData.description || !formData.category || !formData.value || !formData.dueDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newExpense = {
        description: formData.description,
        category: formData.category,
        value: parseCurrency(formData.value),
        due_date: formData.dueDate,
        is_paid: formData.isPaid,
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select();

      if (error) {
        throw error;
      }
      
      toast({
        title: "Despesa adicionada",
        description: "Despesa adicionada com sucesso."
      });
      
      setIsAddModalOpen(false);
      setFormData({
        description: '',
        category: '',
        value: '',
        dueDate: '',
        isPaid: false,
      });
      
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Erro ao adicionar despesa",
        description: "Não foi possível adicionar a despesa. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Despesa excluída",
        description: "Despesa excluída com sucesso."
      });
      
      setActionMenuOpen(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Erro ao excluir despesa",
        description: "Não foi possível excluir a despesa. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllExpenses = async () => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        throw error;
      }
      
      toast({
        title: "Despesas excluídas",
        description: "Todas as despesas foram excluídas com sucesso."
      });
      
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting all expenses:', error);
      toast({
        title: "Erro ao excluir despesas",
        description: "Não foi possível excluir as despesas. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-7xl mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Gestão de Despesas
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Acompanhe e gerencie os custos e despesas da sua empresa
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {expenseCategories.map((category, index) => {
          const CategoryIcon = category.icon;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + (index * 0.05) }}
              className="premium-card p-6 hover:animate-card-hover"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="p-3 rounded-full bg-primary/10 inline-flex mb-3">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Mai, 2024</p>
                </div>
                <div className="text-lg font-semibold">
                  R$ 0,00
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="premium-card p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Buscar despesa..."
              className="pl-10 pr-4 py-2 w-full border border-border rounded-lg subtle-ring-focus text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                <Calendar className="h-4 w-4" />
                <span>Período</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="premium-button flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Despesa</span>
              </button>
              
              {expensesData.length > 0 && (
                <button 
                  onClick={handleDeleteAllExpenses}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir Tudo</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSelectedStatus(null)}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedStatus === null 
                ? "bg-primary text-white" 
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedStatus(true)}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedStatus === true 
                ? "bg-green-500 text-white" 
                : "bg-green-100 text-green-800 hover:bg-green-200"
            )}
          >
            Pagas
          </button>
          <button
            onClick={() => setSelectedStatus(false)}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedStatus === false 
                ? "bg-orange-500 text-white" 
                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
            )}
          >
            A Pagar
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Descrição</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Vencimento</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhuma despesa encontrada
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense, index) => {
                    const ExpenseIcon = expense.icon;
                    
                    return (
                      <motion.tr 
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm">{expense.description}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="p-1.5 rounded-full bg-primary/10 mr-2">
                              <ExpenseIcon className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm">{expense.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">{expense.value}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{expense.due_date}</td>
                        <td className="px-4 py-4">
                          <div className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            expense.is_paid 
                              ? "bg-green-100 text-green-800" 
                              : "bg-orange-100 text-orange-800"
                          )}>
                            {expense.is_paid ? 'Pago' : 'A Pagar'}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right relative">
                          <button 
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setActionMenuOpen(actionMenuOpen === expense.id ? null : expense.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          
                          {actionMenuOpen === expense.id && (
                            <div className="absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-white z-10 border border-border">
                              <div className="py-1" role="menu" aria-orientation="vertical">
                                <button 
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir despesa
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-background rounded-2xl shadow-lg p-6 w-full max-w-lg mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Adicionar Nova Despesa</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="expense-description" className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="expense-description"
                    placeholder="Ex: Aluguel do imóvel"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="expense-category" className="block text-sm font-medium mb-1">
                    Categoria
                  </label>
                  <select
                    id="expense-category"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Selecione a categoria</option>
                    {expenseCategories.map((category) => (
                      <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="expense-value" className="block text-sm font-medium mb-1">
                    Valor
                  </label>
                  <input
                    type="text"
                    id="expense-value"
                    placeholder="R$ 0,00"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.value}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="expense-dueDate" className="block text-sm font-medium mb-1">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    id="expense-dueDate"
                    className="w-full px-3 py-2 border border-border rounded-lg subtle-ring-focus"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is-paid"
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                    checked={formData.isPaid}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="is-paid" className="ml-2 block text-sm">
                    Marcar como pago
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveExpense}
                  className="premium-button flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Salvar Despesa</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
