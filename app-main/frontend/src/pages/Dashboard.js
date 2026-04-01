import { SummaryCard } from '../components/Dashboard/SummaryCard';
import { BalanceTrendChart } from '../components/Dashboard/BalanceTrendChart';
import { SpendingBreakdownChart } from '../components/Dashboard/SpendingBreakdownChart';
import { InsightsCard } from '../components/Dashboard/InsightsCard';
import { TransactionList } from '../components/Transactions/TransactionList';
import { Header } from '../components/Layout/Header';
import { useFinance } from '../context/FinanceContext';

const Dashboard = () => {
  const { balance, totalIncome, totalExpenses, monthlyChange, isLoaded } = useFinance();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white font-['IBM_Plex_Sans']">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="dashboard">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-none font-bold font-['Cabinet_Grotesk'] text-white">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] font-['IBM_Plex_Sans'] mt-2">
            Track your financial activity and spending patterns
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <SummaryCard 
            title="Total Balance" 
            value={balance} 
            type="balance"
            change={monthlyChange}
          />
          <SummaryCard 
            title="Total Income" 
            value={totalIncome} 
            type="income"
          />
          <SummaryCard 
            title="Total Expenses" 
            value={totalExpenses} 
            type="expense"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <BalanceTrendChart />
          </div>
          <div className="lg:col-span-1">
            <SpendingBreakdownChart />
          </div>
        </div>

        {/* Insights */}
        <div className="mb-6 sm:mb-8">
          <InsightsCard />
        </div>

        {/* Transactions */}
        <TransactionList />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272A] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-[#52525B] font-['IBM_Plex_Sans']">
            Finance Dashboard — Built for tracking your financial journey
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
