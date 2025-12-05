export type TradeDirection = 'long' | 'short';

export interface PositionSizingInput {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
  rewardMultiple: number | null;
}

export interface PositionSizingResult {
  quantity: number;
  riskAmount: number;
  riskPerUnit: number;
  riskPercent: number;
  potentialProfit: number | null;
  rewardMultiple: number | null;
  takeProfit: number | null;
  direction: TradeDirection;
}

export function calculatePositionSizing({
  accountBalance,
  riskPercent,
  entryPrice,
  stopLossPrice,
  rewardMultiple,
}: PositionSizingInput): PositionSizingResult | null {
  if (accountBalance <= 0 || riskPercent <= 0 || riskPercent > 100) {
    return null;
  }

  if (entryPrice <= 0 || stopLossPrice <= 0) {
    return null;
  }

  const rawRiskPerUnit = entryPrice - stopLossPrice;
  if (rawRiskPerUnit === 0) {
    return null;
  }

  const riskPerUnit = Math.abs(rawRiskPerUnit);
  const riskAmount = accountBalance * (riskPercent / 100);
  if (riskAmount <= 0 || riskPerUnit <= 0) {
    return null;
  }

  const quantity = riskAmount / riskPerUnit;
  const direction: TradeDirection = rawRiskPerUnit > 0 ? 'long' : 'short';

  let takeProfit: number | null = null;
  let potentialProfit: number | null = null;

  if (rewardMultiple && rewardMultiple > 0) {
    takeProfit = direction === 'long'
      ? entryPrice + riskPerUnit * rewardMultiple
      : entryPrice - riskPerUnit * rewardMultiple;
    potentialProfit = riskAmount * rewardMultiple;
  }

  return {
    quantity,
    riskAmount,
    riskPerUnit,
    riskPercent,
    potentialProfit,
    rewardMultiple,
    takeProfit,
    direction,
  };
}

export function parseRewardRatio(ratio: string): number | null {
  const trimmed = ratio.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const riskPortion = Number.parseFloat(parts[0]);
  const rewardPortion = Number.parseFloat(parts[1]);

  if (!Number.isFinite(riskPortion) || !Number.isFinite(rewardPortion)) {
    return null;
  }

  if (riskPortion <= 0 || rewardPortion <= 0) {
    return null;
  }

  return rewardPortion / riskPortion;
}

export function formatCurrency(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

export function formatQuantity(value: number): string {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number.parseFloat(value.toFixed(2)));
}

export function formatPrice(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }

  const rounded = Math.round(value * 100) / 100;
  return rounded.toFixed(2);
}

export function formatRatio(multiple: number | null): string | null {
  if (multiple === null || !Number.isFinite(multiple)) {
    return null;
  }

  const normalized = Math.round(multiple * 100) / 100;
  return `1:${normalized}`;
}
