import { User, CaretDown, Export, Eye, UserGear } from '@phosphor-icons/react';
import { useFinance } from '../../context/FinanceContext';

export const Header = ({ onExport }) => {
  const { role, setRole, filteredTransactions } = useFinance();

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <header className="bg-[#0A0A0A] border-b border-[#27272A] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-lg font-['Cabinet_Grotesk']">F</span>
            </div>
            <span className="text-xl font-bold font-['Cabinet_Grotesk'] text-white tracking-tight hidden sm:block">
              Finance
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-transparent border border-[#27272A] text-white rounded-md px-3 py-1.5 hover:bg-[#1A1A1A] transition-colors text-sm font-['IBM_Plex_Sans']"
              data-testid="export-csv-btn"
            >
              <Export size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Role Toggle */}
            <div className="relative">
              <button
                onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors text-sm font-['IBM_Plex_Sans'] ${
                  role === 'admin' 
                    ? 'bg-[#007AFF] text-white hover:bg-[#0066CC]' 
                    : 'bg-[#1A1A1A] border border-[#27272A] text-[#A1A1AA] hover:text-white'
                }`}
                data-testid="role-toggle"
              >
                {role === 'admin' ? (
                  <>
                    <UserGear size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    <span className="hidden sm:inline">Viewer</span>
                  </>
                )}
              </button>
            </div>

            
          </div>
        </div>
      </div>
    </header>
  );
};
