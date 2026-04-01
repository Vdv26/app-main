import { useState } from 'react';
import { 
  MagnifyingGlass, 
  FunnelSimple, 
  ArrowsDownUp, 
  Pencil, 
  Trash, 
  Receipt,
  CaretDown,
  CaretUp
} from '@phosphor-icons/react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionModal } from './TransactionModal';

export const TransactionList = () => {
  const { 
    filteredTransactions, 
    filters, 
    setFilters, 
    categories, 
    role, 
    deleteTransaction 
  } = useFinance();
  
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowsDownUp size={14} className="text-[#52525B]" />;
    return filters.sortOrder === 'desc' 
      ? <CaretDown size={14} className="text-white" weight="bold" />
      : <CaretUp size={14} className="text-white" weight="bold" />;
  };

  return (
    <div 
      className="bg-[#121212] border border-[#27272A] rounded-lg"
      data-testid="transaction-list"
    >
      {/* Header */}
      <div className="p-6 border-b border-[#27272A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl tracking-tight leading-none font-bold font-['Cabinet_Grotesk'] text-white">
            Transactions
          </h2>
          
          {role === 'admin' && (
            <button
              onClick={() => {
                setEditingTransaction(null);
                setShowModal(true);
              }}
              className="bg-white text-black font-semibold rounded-md px-4 py-2 hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-white text-sm"
              data-testid="add-transaction-btn"
            >
              Add Transaction
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full bg-[#1A1A1A] border border-[#27272A] text-white rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder-[#52525B] text-sm font-['IBM_Plex_Sans']"
              data-testid="search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FunnelSimple size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="bg-[#1A1A1A] border border-[#27272A] text-white rounded-md pl-10 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-sm font-['IBM_Plex_Sans'] appearance-none cursor-pointer min-w-[150px]"
              data-testid="category-filter"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="bg-[#1A1A1A] border border-[#27272A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-sm font-['IBM_Plex_Sans'] appearance-none cursor-pointer pr-8 min-w-[120px]"
              data-testid="type-filter"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center" data-testid="empty-state">
          <Receipt size={48} weight="duotone" className="text-[#27272A] mb-4" />
          <p className="text-[#A1A1AA] font-['IBM_Plex_Sans'] text-sm">No transactions found</p>
          <p className="text-[#52525B] font-['IBM_Plex_Sans'] text-xs mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th 
                  className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] border-b border-[#27272A] pb-3 pt-4 px-6 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('date')}
                  data-testid="sort-date"
                >
                  <div className="flex items-center gap-2">
                    Date
                    <SortIcon field="date" />
                  </div>
                </th>
                <th className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] border-b border-[#27272A] pb-3 pt-4 px-6 font-semibold">
                  Description
                </th>
                <th className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] border-b border-[#27272A] pb-3 pt-4 px-6 font-semibold">
                  Category
                </th>
                <th className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] border-b border-[#27272A] pb-3 pt-4 px-6 font-semibold">
                  Type
                </th>
                <th 
                  className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] border-b border-[#27272A] pb-3 pt-4 px-6 font-semibold cursor-pointer hover:text-white transition-colors text-right"
                  onClick={() => handleSort('amount')}
                  data-testid="sort-amount"
                >
                  <div className="flex items-center justify-end gap-2">
                    Amount
                    <SortIcon field="amount" />
                  </div>
                </th>
                {role === 'admin' && (
                  <th className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] border-b border-[#27272A] pb-3 pt-4 px-6 font-semibold text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className="border-b border-[#27272A]/50 hover:bg-[#1A1A1A] transition-colors group"
                  data-testid="transaction-item"
                >
                  <td className="py-4 px-6 text-sm text-[#E4E4E7] font-['IBM_Plex_Sans']">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#E4E4E7] font-['IBM_Plex_Sans']">
                    {transaction.description}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#A1A1AA] font-['IBM_Plex_Sans']">
                    {transaction.category}
                  </td>
                  <td className="py-4 px-6">
                    <span 
                      className={`${
                        transaction.type === 'income' 
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                          : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                      } border rounded-full px-2 py-0.5 text-xs font-medium font-['IBM_Plex_Sans']`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-sm font-medium font-['IBM_Plex_Sans'] text-right ${
                    transaction.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                  {role === 'admin' && (
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingTransaction(transaction);
                            setShowModal(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-[#27272A] transition-colors text-[#A1A1AA] hover:text-white"
                          data-testid="edit-transaction-btn"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-1.5 rounded-md hover:bg-[#EF4444]/10 transition-colors text-[#A1A1AA] hover:text-[#EF4444]"
                          data-testid="delete-transaction-btn"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setShowModal(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};
