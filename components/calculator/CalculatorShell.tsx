'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import DecorativeBackground from '../DecorativeBackground';
import ThemeToggle from '../ThemeToggle';
import CalculatorForm from './CalculatorForm';
import CalculatorResult from './CalculatorResult';
import CalculatorDisclaimer from './CalculatorDisclaimer';
import type { CalculatorFormValues, CalculatorFieldKey } from './types';
import { calculatePositionSizing, parseRewardRatio } from '../../lib/riskReward';

const initialFormValues: CalculatorFormValues = {
  accountBalance: '100000',
  riskPercent: '2',
  entryPrice: '100',
  stopLossPrice: '95',
  riskReward: '1:2',
};

type ParsedForm = {
  accountBalance: number | null;
  riskPercent: number | null;
  entryPrice: number | null;
  stopLossPrice: number | null;
  rewardMultiple: number | null;
};

function parseForm(values: CalculatorFormValues): ParsedForm {
  const parseNumber = (value: string): number | null => {
    const numeric = Number.parseFloat(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const normalizedRatio = values.riskReward.trim();
  const rewardMultiple = normalizedRatio.length === 0 ? null : parseRewardRatio(normalizedRatio) ?? 1;

  return {
    accountBalance: parseNumber(values.accountBalance),
    riskPercent: parseNumber(values.riskPercent),
    entryPrice: parseNumber(values.entryPrice),
    stopLossPrice: parseNumber(values.stopLossPrice),
    rewardMultiple,
  };
}

function validate(parsed: ParsedForm): string | null {
  if (parsed.accountBalance === null || parsed.accountBalance <= 0) {
    return 'Account balance must be a positive number.';
  }

  if (parsed.riskPercent === null || parsed.riskPercent <= 0 || parsed.riskPercent > 100) {
    return 'Risk % must be between 0 and 100.';
  }

  if (parsed.entryPrice === null || parsed.entryPrice <= 0) {
    return 'Entry price must be a positive number.';
  }

  if (parsed.stopLossPrice === null || parsed.stopLossPrice <= 0) {
    return 'Stop loss price must be a positive number.';
  }

  if (parsed.entryPrice === parsed.stopLossPrice) {
    return 'Entry price and stop loss price cannot be the same.';
  }

  if (parsed.rewardMultiple !== null && parsed.rewardMultiple <= 0) {
    return 'Risk/reward ratio must be positive when provided.';
  }

  return null;
}

export default function CalculatorShell() {
  const [formValues, setFormValues] = useState<CalculatorFormValues>(initialFormValues);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const parsedForm = useMemo(() => parseForm(formValues), [formValues]);

  const { error, result } = useMemo(() => {
    const validationError = validate(parsedForm);
    if (validationError) {
      return { error: validationError, result: null } as const;
    }

    const calculation = calculatePositionSizing({
      accountBalance: parsedForm.accountBalance!,
      riskPercent: parsedForm.riskPercent!,
      entryPrice: parsedForm.entryPrice!,
      stopLossPrice: parsedForm.stopLossPrice!,
      rewardMultiple: parsedForm.rewardMultiple,
    });

    if (!calculation) {
      return {
        error: 'Unable to calculate risk/reward with the provided inputs.',
        result: null,
      } as const;
    }

    return { error: null, result: calculation } as const;
  }, [parsedForm]);

  const handleFieldChange = useCallback((key: CalculatorFieldKey, value: string) => {
    setFormValues((previous) => ({ ...previous, [key]: value }));
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((previous) => !previous);
  }, []);

  return (
    <div className="relative h-full min-h-screen overflow-hidden">
      <DecorativeBackground darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-4">
        <section
          className={clsx(
            'w-full max-w-4xl rounded-2xl border p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-500',
            darkMode
              ? 'border-slate-700/50 bg-slate-900/80 shadow-indigo-500/10'
              : 'border-white/50 bg-white/90 shadow-indigo-500/20',
          )}
        >
          <header className="mb-4">
            <div className="mb-1 flex items-center gap-2">
              <div
                className={clsx(
                  'rounded-lg p-1.5',
                  darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600',
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h1
                className={clsx(
                  'text-2xl font-extrabold tracking-tight sm:text-3xl',
                  darkMode ? 'text-white' : 'text-gray-900',
                )}
              >
                Risk Reward Calculator
              </h1>
            </div>
            <p className={clsx('ml-10 text-xs sm:text-sm', darkMode ? 'text-slate-400' : 'text-gray-500')}>
              Calculate optimal position size with smart risk management
            </p>
          </header>

          <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
            <CalculatorForm values={formValues} onChange={handleFieldChange} darkMode={darkMode} />
            <div className="flex flex-col justify-center">
              <CalculatorResult darkMode={darkMode} error={error} result={result} />
            </div>
          </div>

          <CalculatorDisclaimer darkMode={darkMode} />
        </section>
      </div>
    </div>
  );
}
