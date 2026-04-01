import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FinanceContext = createContext(null);

// Generate sample transactions
const generateSampleTransactions = () => {
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Bonus', 'Refund'],
    expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Travel']
  };
  
  const transactions = [];
  const now = new Date();
  
  // Generate 30 sample transactions over the past 6 months
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const type = Math.random() > 0.3 ? 'expense' : 'income';
    const categoryList = categories[type];
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];
    
    const amount = type === 'income' 
      ? Math.floor(Math.random() * 5000) + 500
      : Math.floor(Math.random() * 500) + 10;
    
    transactions.push({
      id: `txn-${i + 1}-${Date.now()}`,
      date: date.toISOString().split('T')[0],
      amount,
      category,
      type,
      description: `${category} payment`
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const STORAGE_KEY = 'finance_dashboard_data';

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState('admin');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setTransactions(data.transactions || []);
        setRole(data.role || 'admin');
      } catch (e) {
        console.error('Failed to parse stored data', e);
        setTransactions(generateSampleTransactions());
      }
    } else {
      setTransactions(generateSampleTransactions());
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, role }));
    }
  }, [transactions, role, isLoaded]);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // Computed values
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         t.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || t.category === filters.category;
    const matchesType = filters.type === 'all' || t.type === filters.type;
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'date') {
      return order * (new Date(a.date) - new Date(b.date));
    }
    if (filters.sortBy === 'amount') {
      return order * (a.amount - b.amount);
    }
    return 0;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categories = [...new Set(transactions.map(t => t.category))];

  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Monthly data for charts
  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {});

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(d => ({
      ...d,
      balance: d.income - d.expense,
      displayMonth: new Date(d.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }));

  // Insights
  const highestSpendingCategory = Object.entries(spendingByCategory)
    .sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  const currentMonth = new Date().toISOString().substring(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 7);
  
  const currentMonthExpense = monthlyData[currentMonth]?.expense || 0;
  const lastMonthExpense = monthlyData[lastMonth]?.expense || 0;
  const monthlyChange = lastMonthExpense > 0 
    ? ((currentMonthExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1)
    : 0;

  const value = {
    transactions,
    filteredTransactions,
    role,
    setRole,
    filters,
    setFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    categories,
    spendingByCategory,
    chartData,
    highestSpendingCategory,
    monthlyChange,
    currentMonthExpense,
    isLoaded
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
