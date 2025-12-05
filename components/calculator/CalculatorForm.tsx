import { clsx } from 'clsx';
import type { CalculatorFieldKey, CalculatorFormValues } from './types';

type CalculatorFormProps = {
  values: CalculatorFormValues;
  onChange: (key: CalculatorFieldKey, value: string) => void;
  darkMode: boolean;
};

type Tint = {
  dark: string;
  light: string;
};

type FieldConfig = {
  key: CalculatorFieldKey;
  label: string;
  placeholder: string;
  type: 'number' | 'text';
  accentDot: Tint;
  presets?: Array<{ value: string; label: string }>;
  presetActiveClass?: Tint;
  helper?: (values: CalculatorFormValues) => string | null;
  helperTint?: Tint;
  min?: number;
  max?: number;
  step?: number | 'any';
};

const accountBalancePresets = [100000, 300000, 500000, 1000000].map((value) => ({
  value: value.toString(),
  label: value >= 1000000 ? `${value / 1000000}M` : `${(value / 1000).toFixed(0)}K`,
}));

const riskPercentPresets = [0.5, 1, 2, 3, 5].map((value) => ({
  value: value.toString(),
  label: `${value}%`,
}));

const riskRewardPresets = ['1:2', '1:3', '1:5'].map((value) => ({
  value,
  label: value,
}));

const fieldConfigs: FieldConfig[] = [
  {
    key: 'accountBalance',
    label: 'Account Balance ($)',
    placeholder: 'e.g., 10000',
    type: 'number',
    accentDot: {
      dark: 'bg-indigo-400',
      light: 'bg-indigo-500',
    },
    presetActiveClass: {
      dark: 'scale-105 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/30',
      light: 'scale-105 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20',
    },
    presets: accountBalancePresets,
    min: 0,
    step: 'any',
  },
  {
    key: 'riskPercent',
    label: 'Risk % (higher = riskier trade)',
    placeholder: 'e.g., 2',
    type: 'number',
    accentDot: {
      dark: 'bg-rose-400',
      light: 'bg-rose-500',
    },
    presetActiveClass: {
      dark: 'scale-105 border-transparent bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30',
      light: 'scale-105 border-transparent bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20',
    },
    presets: riskPercentPresets,
    min: 0,
    max: 100,
    step: 'any',
    helper: (values) => {
      const parsed = Number.parseFloat(values.riskPercent);
      if (!Number.isFinite(parsed)) {
        return null;
      }
      return `Risking ~${parsed.toFixed(2)}% of account balance`;
    },
    helperTint: {
      dark: 'text-rose-300/80',
      light: 'text-rose-500/80',
    },
  },
  {
    key: 'entryPrice',
    label: 'Entry Price ($)',
    placeholder: 'e.g., 100',
    type: 'number',
    accentDot: {
      dark: 'bg-cyan-400',
      light: 'bg-cyan-500',
    },
    min: 0,
    step: 'any',
  },
  {
    key: 'stopLossPrice',
    label: 'Stop Loss Price ($)',
    placeholder: 'e.g., 95',
    type: 'number',
    accentDot: {
      dark: 'bg-orange-400',
      light: 'bg-orange-500',
    },
    min: 0,
    step: 'any',
  },
  {
    key: 'riskReward',
    label: 'Risk/Reward Ratio',
    placeholder: 'e.g., 1:2 or 1:3',
    type: 'text',
    accentDot: {
      dark: 'bg-emerald-400',
      light: 'bg-emerald-500',
    },
    presetActiveClass: {
      dark: 'scale-105 border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30',
      light: 'scale-105 border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20',
    },
    presets: riskRewardPresets,
  },
];

export default function CalculatorForm({ values, onChange, darkMode }: CalculatorFormProps) {
  const sharedInputClasses = clsx(
    'w-full rounded-lg px-3 py-2 text-sm font-medium outline-none transition-all duration-300',
    'focus:ring-2 focus:ring-offset-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
    darkMode
      ? 'border border-slate-600/50 bg-slate-800/80 text-white placeholder-slate-500 focus:ring-offset-slate-900 hover:border-slate-500'
      : 'border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-offset-white hover:border-gray-300',
  );

  const presetButtonClasses = clsx(
    'rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-300',
    darkMode
      ? 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
      : 'border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200',
  );

  return (
    <div className="space-y-3">
      {fieldConfigs.map((field) => {
        const value = values[field.key] ?? '';
        const helperText = field.helper?.(values) ?? null;
        const isPresetActive = (presetValue: string) => presetValue === value;

        return (
          <div key={field.key} className="group">
            <label
              className={clsx(
                'mb-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-300',
                darkMode ? 'text-slate-300' : 'text-gray-700',
              )}
              htmlFor={field.key}
            >
              <span
                className={clsx(
                  'h-1 w-1 rounded-full',
                  darkMode ? field.accentDot.dark : field.accentDot.light,
                )}
              />
              {field.label}
            </label>
            <input
              id={field.key}
              type={field.type}
              inputMode={field.type === 'number' ? 'decimal' : 'text'}
              min={field.min}
              max={field.max}
              step={field.step}
              value={value}
              placeholder={field.placeholder}
              className={sharedInputClasses}
              onChange={(event) => onChange(field.key, event.target.value)}
            />
            {helperText ? (
              <p
                className={clsx(
                  'mt-1 text-[10px] font-medium',
                  field.helperTint ? (darkMode ? field.helperTint.dark : field.helperTint.light) : undefined,
                )}
              >
                {helperText}
              </p>
            ) : null}
            {field.presets && field.presets.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {field.presets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onChange(field.key, preset.value)}
                    className={clsx(
                      presetButtonClasses,
                      isPresetActive(preset.value) &&
                        (darkMode
                          ? field.presetActiveClass?.dark ??
                            'scale-105 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/30'
                          : field.presetActiveClass?.light ??
                            'scale-105 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'),
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
