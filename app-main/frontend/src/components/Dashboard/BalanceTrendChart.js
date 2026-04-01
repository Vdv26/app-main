import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFinance } from '../../context/FinanceContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121212] border border-[#27272A] rounded-lg p-3 shadow-xl">
        <p className="text-xs text-[#A1A1AA] font-['IBM_Plex_Sans'] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-white font-['IBM_Plex_Sans']">
              {entry.name}: ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const BalanceTrendChart = () => {
  const { chartData } = useFinance();

  if (chartData.length === 0) {
    return (
      <div 
        className="bg-[#121212] border border-[#27272A] rounded-lg p-6 h-full flex flex-col"
        data-testid="balance-trend-chart"
      >
        <h3 className="text-lg sm:text-xl tracking-tight leading-snug font-medium font-['Cabinet_Grotesk'] text-white mb-4">
          Balance Trend
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#52525B] text-sm font-['IBM_Plex_Sans']">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-[#121212] border border-[#27272A] rounded-lg p-6 h-full flex flex-col hover:border-[#52525B] transition-colors duration-200"
      data-testid="balance-trend-chart"
    >
      <h3 className="text-lg sm:text-xl tracking-tight leading-snug font-medium font-['Cabinet_Grotesk'] text-white mb-4">
        Balance Trend
      </h3>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis 
              dataKey="displayMonth" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'IBM Plex Sans' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'IBM Plex Sans' }}
              tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              strokeWidth={2}
              fill="url(#incomeGradient)" 
              name="Income"
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#EF4444" 
              strokeWidth={2}
              fill="url(#expenseGradient)" 
              name="Expenses"
            />
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
