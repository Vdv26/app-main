import { Lightning, TrendUp, TrendDown, ChartLineUp, Target } from '@phosphor-icons/react';
import { useFinance } from '../../context/FinanceContext';

export const InsightsCard = () => {
  const { 
    highestSpendingCategory, 
    monthlyChange, 
    currentMonthExpense,
    totalExpenses,
    totalIncome,
    transactions
  } = useFinance();

  const savingsRate = totalIncome > 0 
    ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) 
    : 0;

  const avgTransactionAmount = transactions.length > 0
    ? (transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(0)
    : 0;

  const insights = [
    {
      icon: <Target size={18} weight="regular" />,
      label: 'Top Spending Category',
      value: highestSpendingCategory[0],
      subtext: `$${highestSpendingCategory[1].toLocaleString()} spent`,
      color: 'text-white'
    },
    {
      icon: parseFloat(monthlyChange) <= 0 ? <TrendDown size={18} weight="regular" /> : <TrendUp size={18} weight="regular" />,
      label: 'Monthly Spending Trend',
      value: `${Math.abs(parseFloat(monthlyChange))}%`,
      subtext: parseFloat(monthlyChange) <= 0 ? 'decrease from last month' : 'increase from last month',
      color: parseFloat(monthlyChange) <= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
    },
    {
      icon: <ChartLineUp size={18} weight="regular" />,
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      subtext: 'of total income saved',
      color: parseFloat(savingsRate) >= 20 ? 'text-[#10B981]' : 'text-[#F59E0B]'
    },
    {
      icon: <Lightning size={18} weight="regular" />,
      label: 'Avg Transaction',
      value: `$${parseInt(avgTransactionAmount).toLocaleString()}`,
      subtext: `across ${transactions.length} transactions`,
      color: 'text-white'
    }
  ];

  return (
    <div 
      className="bg-[#121212] border border-[#27272A] rounded-lg p-6 hover:border-[#52525B] transition-colors duration-200"
      data-testid="insights-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <Lightning size={20} weight="fill" className="text-[#007AFF]" />
        <h3 className="text-lg sm:text-xl tracking-tight leading-snug font-medium font-['Cabinet_Grotesk'] text-white">
          Quick Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className="bg-[#0A0A0A] border border-[#27272A] rounded-lg p-4 hover:border-[#52525B] transition-colors duration-200"
            data-testid={`insight-${index}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#A1A1AA]">{insight.icon}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#52525B] font-['IBM_Plex_Sans']">
                {insight.label}
              </span>
            </div>
            <p className={`text-xl font-bold font-['Cabinet_Grotesk'] ${insight.color} mb-1`}>
              {insight.value}
            </p>
            <p className="text-xs text-[#52525B] font-['IBM_Plex_Sans']">
              {insight.subtext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
