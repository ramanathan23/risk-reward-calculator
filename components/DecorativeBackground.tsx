type DecorativeBackgroundProps = {
  darkMode: boolean;
};

type Candle = {
  price: number;
  isGreen: boolean;
  bodyHeight: number;
  wickTop: number;
  wickBottom: number;
};

const CANDLE_COUNT = 45;
const CANDLE_SPACING = 24;

function generateCandles(count: number): Candle[] {
  const result: Candle[] = [];
  let currentPrice = 30;

  for (let index = 0; index < count; index += 1) {
    const trend = 3;
    const volatility = Math.sin(index * 0.5) * 5 + (index % 3 === 0 ? -2 : 3);
    currentPrice += trend + volatility;
    const isGreen = index % 5 !== 0 && index % 7 !== 0;

    result.push({
      price: currentPrice,
      isGreen,
      bodyHeight: 10 + (index % 4) * 6,
      wickTop: 3 + (index % 3) * 3,
      wickBottom: 2 + (index % 4) * 2,
    });
  }

  return result;
}

const candles = generateCandles(CANDLE_COUNT);

function calculateSMA(source: Candle[], period: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < source.length; i += 1) {
    const slice = source.slice(Math.max(0, i - period + 1), i + 1);
    const sum = slice.reduce((total, candle) => total + candle.price, 0);
    result.push(sum / slice.length);
  }

  return result;
}

const sma5 = calculateSMA(candles, 5);
const sma10 = calculateSMA(candles, 10);
const sma20 = calculateSMA(candles, 20);

function buildSMAPath(values: number[]): string {
  return values
    .map((value, index) => {
      const x = index * CANDLE_SPACING + 12;
      const y = 560 - value * 1.8;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function DecorativeBackground({ darkMode }: DecorativeBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          darkMode
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'
        }`}
      />

      <div
        className={`absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl transition-all duration-700 ${
          darkMode ? 'bg-blue-600/20' : 'bg-blue-300/40'
        }`}
      />
      <div
        className={`absolute top-1/2 -right-32 h-80 w-80 rounded-full blur-3xl transition-all duration-700 ${
          darkMode ? 'bg-purple-600/15' : 'bg-purple-300/30'
        }`}
      />
      <div
        className={`absolute -bottom-32 left-1/3 h-96 w-96 rounded-full blur-3xl transition-all duration-700 ${
          darkMode ? 'bg-indigo-600/20' : 'bg-indigo-300/30'
        }`}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="chartGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chartGrid)" />

        <g transform="translate(40, 0)" opacity={darkMode ? 0.5 : 0.4}>
          {candles.map((candle, index) => {
            const x = index * CANDLE_SPACING;
            const candleY = 550 - candle.price * 1.8;
            const greenColor = darkMode ? '#22c55e' : '#16a34a';
            const redColor = darkMode ? '#ef4444' : '#dc2626';
            const color = candle.isGreen ? greenColor : redColor;

            return (
              <g key={index} transform={`translate(${x}, 0)`}>
                <line
                  x1="6"
                  y1={candleY - candle.bodyHeight / 2 - candle.wickTop}
                  x2="6"
                  y2={candleY - candle.bodyHeight / 2}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect
                  x="1"
                  y={candleY - candle.bodyHeight / 2}
                  width="10"
                  height={candle.bodyHeight}
                  fill={color}
                  rx="1"
                />
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

          <path
            d={buildSMAPath(sma5)}
            fill="none"
            stroke="#facc15"
            strokeWidth="1.5"
            opacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={buildSMAPath(sma10)}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.5"
            opacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={buildSMAPath(sma20)}
            fill="none"
            stroke="#f472b6"
            strokeWidth="1.5"
            opacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <g transform="translate(1020, 20)">
          <rect
            x="-12"
            y="-8"
            width="110"
            height="80"
            rx="8"
            fill={darkMode ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.8)'}
            stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            strokeWidth="1"
          />

          <line x1="0" y1="10" x2="20" y2="10" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <text x="28" y="14" fill={darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} fontSize="11" fontFamily="system-ui">
            SMA 5
          </text>

          <line x1="0" y1="30" x2="20" y2="30" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
          <text x="28" y="34" fill={darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} fontSize="11" fontFamily="system-ui">
            SMA 10
          </text>

          <line x1="0" y1="50" x2="20" y2="50" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
          <text x="28" y="54" fill={darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} fontSize="11" fontFamily="system-ui">
            SMA 20
          </text>
        </g>
      </svg>
    </div>
  );
}
