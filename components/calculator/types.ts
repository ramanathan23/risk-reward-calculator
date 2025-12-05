export type CalculatorFieldKey =
  | 'accountBalance'
  | 'riskPercent'
  | 'entryPrice'
  | 'stopLossPrice'
  | 'riskReward';

export type CalculatorFormValues = Record<CalculatorFieldKey, string>;
