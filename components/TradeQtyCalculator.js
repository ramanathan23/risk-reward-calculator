import React, { useState, useEffect } from 'react';
import DecorativeBackground from './DecorativeBackground';

export default function TradeQtyCalculator() {
  const [accountBalance, setAccountBalance] = useState('100000');
  const [riskPercent, setRiskPercent] = useState('2');
  const [entryPrice, setEntryPrice] = useState('100');
  const [stopLossPrice, setStopLossPrice] = useState('95');
  const [riskRewardRatio, setRiskRewardRatio] = useState('1:2');
  const [quantity, setQuantity] = useState(null);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // Initialize dark mode from system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const accountBalanceOptions = [100000, 300000, 500000, 1000000];
  const riskPercentOptions = [1, 2, 5];
  const riskRewardOptions = ['1:2', '1:3', '2:5'];

  // Real-time calculation whenever inputs change
  useEffect(() => {
    if (accountBalance && riskPercent && entryPrice && stopLossPrice) {
      calculateQty();
    } else {
      setQuantity(null);
    }
  }, [accountBalance, riskPercent, entryPrice, stopLossPrice, riskRewardRatio]);

  const calculateQty = () => {
    setError('');
    setQuantity(null);

    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLossPrice);

    // Validation
    if (isNaN(balance) || balance <= 0) {
      setError('Account balance must be a positive number');
      return;
    }
    if (isNaN(risk) || risk <= 0 || risk > 100) {
      setError('Risk % must be between 0 and 100');
      return;
    }
    if (isNaN(entry) || entry <= 0) {
      setError('Entry price must be a positive number');
      return;
    }
    if (isNaN(stop) || stop <= 0) {
      setError('Stop loss price must be a positive number');
      return;
    }
    if (entry === stop) {
      setError('Entry price and stop loss price cannot be the same');
      return;
    }

    // Parse R:R ratio - first number is risk multiplier, second is reward multiplier
    let riskMultiplier = 1;
    let rewardMultiplier = 1;
    if (riskRewardRatio) {
      const parts = riskRewardRatio.split(':');
      riskMultiplier = parseFloat(parts[0]) || 1;
      rewardMultiplier = parseFloat(parts[1]) || 1;
    }

    // Calculate quantity with scaled risk
    const actualRiskPercent = risk * riskMultiplier;
    const riskAmount = balance * (actualRiskPercent / 100);
    const tradeRisk = Math.abs(entry - stop);
    const qty = riskAmount / tradeRisk;

    // Calculate take-profit based on R:R ratio
    let takeProfit = null;
    let profitAmount = null;
    if (riskRewardRatio) {
      profitAmount = balance * (risk / 100) * rewardMultiplier;
      takeProfit = entry > stop 
        ? entry + (profitAmount / qty) 
        : entry - (profitAmount / qty);
    }

    setQuantity({
      qty: qty.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      actualRiskPercent: actualRiskPercent.toFixed(1),
      tradeRisk: tradeRisk.toFixed(2),
      takeProfit: takeProfit ? takeProfit.toFixed(2) : null,
      profitAmount: profitAmount ? profitAmount.toFixed(2) : null,
      actualRR: riskRewardRatio || null,
    });
  };

  return (
    <div className="h-screen relative overflow-hidden">
      <DecorativeBackground darkMode={darkMode} />
      <div className="relative z-10 h-screen p-3 sm:p-4 flex items-center justify-center">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`fixed top-6 right-6 p-3 rounded-2xl transition-all duration-500 shadow-xl backdrop-blur-md z-20 group ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-300' 
              : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 text-indigo-600'
          }`}
          aria-label="Toggle dark mode"
        >
          <div className="relative">
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </div>
        </button>

        <div className={`max-w-4xl w-full backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 border transition-all duration-500 ${
          darkMode 
            ? 'bg-slate-900/80 border-slate-700/50 shadow-indigo-500/10' 
            : 'bg-white/90 border-white/50 shadow-indigo-500/20'
        }`}>
          
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Risk Reward Calculator
              </h2>
            </div>
            <p className={`text-xs sm:text-sm ml-10 transition-colors duration-300 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Calculate optimal position size with smart risk management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            {/* Left Column: Inputs */}
            <div className="space-y-3">
              {/* Account Balance */}
              <div className="group">
                <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 transition-colors duration-300 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
                  Account Balance ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  placeholder="e.g., 10000"
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 outline-none transition-all duration-300 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    darkMode 
                      ? 'bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-500 focus:ring-offset-slate-900 hover:border-slate-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-offset-white hover:border-gray-300'
                  } border`}
                />
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {accountBalanceOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAccountBalance(option.toString())}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        accountBalance === option.toString()
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/30 scale-105'
                          : darkMode 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      ${option >= 1000000 ? `${option / 1000000}M` : `${(option / 1000).toFixed(0)}K`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Percent */}
              <div className="group">
                <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 transition-colors duration-300 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-rose-400' : 'bg-rose-500'}`}></span>
                  Risk % per Trade
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  placeholder="e.g., 2"
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 outline-none transition-all duration-300 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    darkMode 
                      ? 'bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-500 focus:ring-offset-slate-900 hover:border-slate-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-offset-white hover:border-gray-300'
                  } border`}
                />
                <div className="flex gap-1.5 mt-2">
                  {riskPercentOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRiskPercent(option.toString())}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        riskPercent === option.toString()
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30 scale-105'
                          : darkMode 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {option}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Entry Price */}
              <div className="group">
                <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 transition-colors duration-300 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-cyan-500'}`}></span>
                  Entry Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="e.g., 100"
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 outline-none transition-all duration-300 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    darkMode 
                      ? 'bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-500 focus:ring-offset-slate-900 hover:border-slate-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-offset-white hover:border-gray-300'
                  } border`}
                />
              </div>

              {/* Stop Loss */}
              <div className="group">
                <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 transition-colors duration-300 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-orange-400' : 'bg-orange-500'}`}></span>
                  Stop Loss Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  placeholder="e.g., 95"
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 outline-none transition-all duration-300 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    darkMode 
                      ? 'bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-500 focus:ring-offset-slate-900 hover:border-slate-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-offset-white hover:border-gray-300'
                  } border`}
                />
              </div>

              {/* Risk/Reward Ratio */}
              <div className="group">
                <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 transition-colors duration-300 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                  Risk/Reward Ratio
                </label>
                <input
                  type="text"
                  value={riskRewardRatio}
                  onChange={(e) => setRiskRewardRatio(e.target.value)}
                  placeholder="e.g., 1:2 or 1:3"
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 outline-none transition-all duration-300 text-sm font-medium ${
                    darkMode 
                      ? 'bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-500 focus:ring-offset-slate-900 hover:border-slate-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-offset-white hover:border-gray-300'
                  } border`}
                />
                <div className="flex gap-1.5 mt-2">
                  {riskRewardOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRiskRewardRatio(option)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        riskRewardRatio === option
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                          : darkMode 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="flex flex-col justify-center">
              {error && (
                <div className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                  darkMode 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}

              {quantity && (
                <div className="space-y-2">
                  {/* Main Result - Quantity */}
                  <div className={`p-4 rounded-xl border relative overflow-hidden ${
                    darkMode 
                      ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-indigo-500/30' 
                      : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
                  }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                    <p className={`text-xs font-semibold mb-1 flex items-center gap-1.5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Quantity to Trade
                    </p>
                    <p className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-indigo-700'}`}>{quantity.qty}</p>
                    <p className={`text-xs font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>units</p>
                  </div>

                  {/* Secondary Results */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Risk per Unit */}
                    <div className={`p-2.5 rounded-lg border ${
                      darkMode 
                        ? 'bg-orange-500/10 border-orange-500/30' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <p className={`text-[10px] font-semibold mb-0.5 ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>Risk per Unit</p>
                      <p className={`text-base font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>${quantity.tradeRisk}</p>
                    </div>

                    {/* Take Profit */}
                    {quantity.takeProfit && (
                      <div className={`p-2.5 rounded-lg border ${
                        darkMode 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-emerald-50 border-emerald-200'
                      }`}>
                        <p className={`text-[10px] font-semibold mb-0.5 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>Take Profit ({quantity.actualRR})</p>
                        <p className={`text-base font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>${quantity.takeProfit}</p>
                      </div>
                    )}
                  </div>

                  {/* Amount Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Risk Amount */}
                    <div className={`p-2.5 rounded-lg border ${
                      darkMode 
                        ? 'bg-rose-500/10 border-rose-500/30' 
                        : 'bg-rose-50 border-rose-200'
                    }`}>
                      <p className={`text-[10px] font-semibold mb-0.5 flex items-center gap-1 ${darkMode ? 'text-rose-300' : 'text-rose-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                        Risk Amount ({quantity.actualRiskPercent}%)
                      </p>
                      <p className={`text-base font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>${quantity.riskAmount}</p>
                    </div>

                    {/* Profit Amount */}
                    {quantity.profitAmount && (
                      <div className={`p-2.5 rounded-lg border ${
                        darkMode 
                          ? 'bg-teal-500/10 border-teal-500/30' 
                          : 'bg-teal-50 border-teal-200'
                      }`}>
                        <p className={`text-[10px] font-semibold mb-0.5 flex items-center gap-1 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Profit Amount
                        </p>
                        <p className={`text-base font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>${quantity.profitAmount}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!error && !quantity && (
                <div className={`p-6 rounded-xl border border-dashed text-center ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-600' 
                    : 'bg-gray-50/50 border-gray-300'
                }`}>
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-slate-700' : 'bg-gray-200'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Enter values to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
            <p className={`text-[10px] text-center leading-relaxed ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
              <span className="font-semibold">Disclaimer:</span> This calculator is for educational and informational purposes only. 
              It does not constitute financial advice. Trading involves significant risk of loss. 
              Past performance is not indicative of future results. Always consult a qualified financial advisor before making investment decisions.
            </p>
            
            {/* Developer Links */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <a 
                href="https://github.com/ramanathan23" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
                  darkMode 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </a>
              <span className={`${darkMode ? 'text-slate-600' : 'text-gray-300'}`}>•</span>
              <a 
                href="mailto:c.ramanathan23@gmail.com"
                className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
                  darkMode 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
