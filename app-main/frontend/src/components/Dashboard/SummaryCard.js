import { TrendUp, TrendDown, Wallet, ArrowUp, ArrowDown } from '@phosphor-icons/react';

export const SummaryCard = ({ title, value, type, change }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getIcon = () => {
    switch (type) {
      case 'balance':
        return <Wallet size={20} weight="regular" />;
      case 'income':
        return <ArrowUp size={20} weight="regular" />;
      case 'expense':
        return <ArrowDown size={20} weight="regular" />;
      default:
        return <Wallet size={20} weight="regular" />;
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'income':
        return 'text-[#10B981]';
      case 'expense':
        return 'text-[#EF4444]';
      default:
        return 'text-white';
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'income':
        return 'bg-[#10B981]/10 text-[#10B981]';
      case 'expense':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      default:
        return 'bg-white/10 text-white';
    }
  };

  return (
    <div 
      className="bg-[#121212] border border-[#27272A] rounded-lg p-6 flex flex-col h-full hover:border-[#52525B] transition-colors duration-200"
      data-testid={`summary-card-${type}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-['IBM_Plex_Sans']">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${getIconBg()}`}>
          {getIcon()}
        </div>
      </div>
      
      <div className={`text-2xl sm:text-3xl tracking-tight leading-none font-bold font-['Cabinet_Grotesk'] ${getValueColor()}`}>
        {formatCurrency(value)}
      </div>
      
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {parseFloat(change) >= 0 ? (
            <TrendUp size={14} className="text-[#10B981]" weight="bold" />
          ) : (
            <TrendDown size={14} className="text-[#EF4444]" weight="bold" />
          )}
          <span className={`text-sm font-['IBM_Plex_Sans'] ${parseFloat(change) >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {Math.abs(parseFloat(change))}%
          </span>
          <span className="text-sm text-[#52525B] font-['IBM_Plex_Sans']">vs last month</span>
        </div>
      )}
    </div>
  );
};
