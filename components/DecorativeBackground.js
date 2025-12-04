export default function DecorativeBackground({ darkMode = true }) {
  // Generate uptrending candlestick data with fixed seed for consistency
  const candles = [];
  const basePrice = 30;
  let currentPrice = basePrice;
  
  for (let i = 0; i < 45; i++) {
    const trend = 3.0;
    const volatility = (Math.sin(i * 0.5) * 5) + (i % 3 === 0 ? -2 : 3);
    currentPrice = currentPrice + trend + volatility;
    
    const isGreen = (i % 5 !== 0) && (i % 7 !== 0);
    const bodyHeight = 10 + (i % 4) * 6;
    const wickTop = 3 + (i % 3) * 3;
    const wickBottom = 2 + (i % 4) * 2;
    
    candles.push({
      price: currentPrice,
      isGreen,
      bodyHeight,
      wickTop,
      wickBottom,
    });
  }

  // Calculate SMA values
  const calculateSMA = (period) => {
    const smaPoints = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        let sum = 0;
        for (let j = 0; j <= i; j++) {
          sum += candles[j].price;
        }
        smaPoints.push(sum / (i + 1));
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[i - j].price;
        }
        smaPoints.push(sum / period);
      }
    }
    return smaPoints;
  };

  const sma5 = calculateSMA(5);
  const sma10 = calculateSMA(10);
  const sma20 = calculateSMA(20);

  // Create SVG path for SMA line
  const createSMAPath = (smaValues) => {
    const spacing = 24;
    let path = '';
    smaValues.forEach((value, i) => {
      const x = i * spacing + 12;
      const y = 560 - (value * 1.8);
      if (i === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Main Gradient Background */}
      <div className={`absolute inset-0 transition-all duration-700 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'
      }`} />

      {/* Ambient Glow Orbs */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${
        darkMode ? 'bg-blue-600/20' : 'bg-blue-300/40'
      }`} />
      <div className={`absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl transition-all duration-700 ${
        darkMode ? 'bg-purple-600/15' : 'bg-purple-300/30'
      }`} />
      <div className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${
        darkMode ? 'bg-indigo-600/20' : 'bg-indigo-300/30'
      }`} />

      {/* Candlestick Chart */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Subtle Grid */}
        <defs>
          <pattern id="chartGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path 
              d="M 60 0 L 0 0 0 60" 
              fill="none" 
              stroke={darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"} 
              strokeWidth="1" 
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chartGrid)" />

        {/* Candlesticks */}
        <g transform="translate(40, 0)" opacity={darkMode ? "0.5" : "0.4"}>
          {candles.map((candle, i) => {
            const x = i * 24;
            const candleY = 550 - (candle.price * 1.8);
            const greenColor = darkMode ? "#22c55e" : "#16a34a";
            const redColor = darkMode ? "#ef4444" : "#dc2626";
            const color = candle.isGreen ? greenColor : redColor;
            
            return (
              <g key={i} transform={`translate(${x}, 0)`}>
                {/* Top Wick */}
                <line
                  x1="6"
                  y1={candleY - candle.bodyHeight / 2 - candle.wickTop}
                  x2="6"
                  y2={candleY - candle.bodyHeight / 2}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Body */}
                <rect
                  x="1"
                  y={candleY - candle.bodyHeight / 2}
                  width="10"
                  height={candle.bodyHeight}
                  fill={color}
                  rx="1"
                />
                {/* Bottom Wick */}
                <line
                  x1="6"
                  y1={candleY + candle.bodyHeight / 2}
                  x2="6"
                  y2={candleY + candle.bodyHeight / 2 + candle.wickBottom}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* SMA Lines */}
          <path
            d={createSMAPath(sma5)}
            fill="none"
            stroke="#facc15"
            strokeWidth="1.5"
            opacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={createSMAPath(sma10)}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.5"
            opacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={createSMAPath(sma20)}
            fill="none"
            stroke="#f472b6"
            strokeWidth="1.5"
            opacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Legend */}
        <g transform="translate(1020, 20)">
          <rect 
            x="-12" 
            y="-8" 
            width="110" 
            height="80" 
            rx="8" 
            fill={darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.8)"}
            stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            strokeWidth="1"
          />
          
          <line x1="0" y1="10" x2="20" y2="10" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <text x="28" y="14" fill={darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"} fontSize="11" fontFamily="system-ui">SMA 5</text>
          
          <line x1="0" y1="30" x2="20" y2="30" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
          <text x="28" y="34" fill={darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"} fontSize="11" fontFamily="system-ui">SMA 10</text>
          
          <line x1="0" y1="50" x2="20" y2="50" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
          <text x="28" y="54" fill={darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"} fontSize="11" fontFamily="system-ui">SMA 20</text>
        </g>
      </svg>
    </div>
  );
}
