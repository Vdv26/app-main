import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';

const COLORS = ['#FFFFFF', '#A1A1AA', '#71717A', '#52525B', '#3F3F46', '#27272A', '#18181B', '#09090B'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121212] border border-[#27272A] rounded-lg p-3 shadow-xl">
        <p className="text-sm text-white font-['IBM_Plex_Sans'] font-medium">
          {payload[0].name}
        </p>
        <p className="text-xs text-[#A1A1AA] font-['IBM_Plex_Sans']">
          ${payload[0].value.toLocaleString()} ({payload[0].payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const SpendingBreakdownChart = () => {
  const { spendingByCategory, totalExpenses } = useFinance();

  const data = Object.entries(spendingByCategory)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div 
        className="bg-[#121212] border border-[#27272A] rounded-lg p-6 h-full flex flex-col"
        data-testid="spending-breakdown-chart"
      >
        <h3 className="text-lg sm:text-xl tracking-tight leading-snug font-medium font-['Cabinet_Grotesk'] text-white mb-4">
          Spending Breakdown
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#52525B] text-sm font-['IBM_Plex_Sans']">No expenses recorded</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-[#121212] border border-[#27272A] rounded-lg p-6 h-full flex flex-col hover:border-[#52525B] transition-colors duration-200"
      data-testid="spending-breakdown-chart"
    >
      <h3 className="text-lg sm:text-xl tracking-tight leading-snug font-medium font-['Cabinet_Grotesk'] text-white mb-4">
        Spending Breakdown
      </h3>
      
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#0A0A0A"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-[#A1A1AA] font-['IBM_Plex_Sans'] truncate max-w-[100px]">
                {item.name}
              </span>
            </div>
            <span className="text-sm text-white font-['IBM_Plex_Sans']">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
