import { clsx } from 'clsx';
import type { PositionSizingResult } from '../../lib/riskReward';
import { formatCurrency, formatPrice, formatQuantity, formatRatio } from '../../lib/riskReward';

type CalculatorResultProps = {
  darkMode: boolean;
  error: string | null;
  result: PositionSizingResult | null;
};

export default function CalculatorResult({ darkMode, error, result }: CalculatorResultProps) {
  if (error) {
    return (
      <div
        className={clsx(
          'flex items-start gap-2 rounded-xl p-3 text-xs font-medium',
          darkMode
            ? 'border border-red-500/30 bg-red-500/10 text-red-300'
            : 'border border-red-200 bg-red-50 text-red-600',
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mt-0.5 h-4 w-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {error}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const ratioLabel = formatRatio(result.rewardMultiple);

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          'relative overflow-hidden rounded-xl border p-4',
          darkMode
            ? 'border-indigo-500/30 bg-gradient-to-br from-indigo-900/60 to-purple-900/60'
            : 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50',
        )}
      >
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
        <p
          className={clsx(
            'mb-1 flex items-center gap-1.5 text-xs font-semibold',
            darkMode ? 'text-indigo-300' : 'text-indigo-600',
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Quantity to Trade
        </p>
        <p className={clsx('text-4xl font-black tracking-tight', darkMode ? 'text-white' : 'text-indigo-700')}>
          {formatQuantity(result.quantity)}
        </p>
        <p className={clsx('text-xs font-medium', darkMode ? 'text-indigo-400' : 'text-indigo-500')}>units</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="Risk Amount"
          value={formatCurrency(result.riskAmount)}
          darkMode={darkMode}
        />
        <StatCard
          label="Risk Per Unit"
          value={`$${formatPrice(result.riskPerUnit)}`}
          darkMode={darkMode}
        />
        <StatCard
          label="Risk %"
          value={`${result.riskPercent.toFixed(2)}%`}
          darkMode={darkMode}
        />
        <StatCard
          label="Potential Profit"
          value={formatCurrency(result.potentialProfit)}
          darkMode={darkMode}
        />
        <StatCard
          label="Take Profit"
          value={result.takeProfit ? `$${formatPrice(result.takeProfit)}` : '—'}
          darkMode={darkMode}
        />
        <StatCard
          label="Risk/Reward"
          value={ratioLabel ?? '—'}
          darkMode={darkMode}
        />
        <StatCard
          label="Directional Bias"
          value={result.direction === 'long' ? 'Long (bullish)' : 'Short (bearish)'}
          darkMode={darkMode}
        />
        <StatCard
          label="Reward Multiple"
          value={result.rewardMultiple ? `${result.rewardMultiple.toFixed(2)}x` : '—'}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  darkMode: boolean;
};

function StatCard({ label, value, darkMode }: StatCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border p-3',
        darkMode
          ? 'border-slate-700/50 bg-slate-900/60 text-slate-200'
          : 'border-slate-200 bg-white/80 text-slate-700',
      )}
    >
      <p
        className={clsx(
          'text-[11px] font-semibold uppercase tracking-wide',
          darkMode ? 'text-slate-400' : 'text-slate-500',
        )}
      >
        {label}
      </p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
