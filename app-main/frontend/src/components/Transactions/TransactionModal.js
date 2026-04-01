import { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { useFinance } from '../../context/FinanceContext';

const EXPENSE_CATEGORIES = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Travel'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Bonus', 'Refund'];

export const TransactionModal = ({ transaction, onClose }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    type: transaction?.type || 'expense',
    description: transaction?.description || ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Reset category when type changes if current category doesn't match
    const validCategories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (formData.category && !validCategories.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.type, formData.category]);

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (isEditing) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="transaction-modal">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#121212] border border-[#27272A] rounded-lg w-full max-w-md p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl tracking-tight leading-none font-bold font-['Cabinet_Grotesk'] text-white">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#27272A] transition-colors text-[#A1A1AA] hover:text-white"
            data-testid="close-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-['IBM_Plex_Sans'] mb-2 block">
              Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-[#EF4444] text-white'
                    : 'bg-[#1A1A1A] border border-[#27272A] text-[#A1A1AA] hover:text-white'
                }`}
                data-testid="type-expense-btn"
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                  formData.type === 'income'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#1A1A1A] border border-[#27272A] text-[#A1A1AA] hover:text-white'
                }`}
                data-testid="type-income-btn"
              >
                Income
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-['IBM_Plex_Sans'] mb-2 block">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-[#1A1A1A] border border-[#27272A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-sm font-['IBM_Plex_Sans']"
              data-testid="date-input"
            />
            {errors.date && <p className="text-[#EF4444] text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-['IBM_Plex_Sans'] mb-2 block">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-[#1A1A1A] border border-[#27272A] text-white rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder-[#52525B] text-sm font-['IBM_Plex_Sans']"
                data-testid="amount-input"
              />
            </div>
            {errors.amount && <p className="text-[#EF4444] text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-['IBM_Plex_Sans'] mb-2 block">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-[#1A1A1A] border border-[#27272A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-sm font-['IBM_Plex_Sans']"
              data-testid="category-input"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-[#EF4444] text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-['IBM_Plex_Sans'] mb-2 block">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              className="w-full bg-[#1A1A1A] border border-[#27272A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder-[#52525B] text-sm font-['IBM_Plex_Sans']"
              data-testid="description-input"
            />
            {errors.description && <p className="text-[#EF4444] text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-[#27272A] text-white rounded-md px-4 py-2 hover:bg-[#1A1A1A] transition-colors text-sm font-semibold"
              data-testid="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-white text-black font-semibold rounded-md px-4 py-2 hover:bg-gray-200 transition-colors text-sm"
              data-testid="submit-transaction-btn"
            >
              {isEditing ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
