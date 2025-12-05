import { clsx } from 'clsx';

type CalculatorDisclaimerProps = {
  darkMode: boolean;
};

export default function CalculatorDisclaimer({ darkMode }: CalculatorDisclaimerProps) {
  return (
    <footer
      className={clsx(
        'mt-6 border-t pt-4 text-center text-[10px] leading-relaxed',
        darkMode ? 'border-slate-700/50 text-slate-500' : 'border-gray-200 text-gray-500',
      )}
    >
      <p className="mx-auto max-w-2xl">
        <span className="font-semibold">Disclaimer:</span> This calculator is for educational and informational purposes
        only and does not constitute financial advice. Trading involves significant risk of loss, and you are solely
        responsible for the outcomes of your trades; we are not responsible for any losses incurred. Past performance does
        not guarantee future results. Consult a qualified financial advisor before making investment decisions.
      </p>

      <div className="mt-3 flex items-center justify-center gap-4">
        <a
          href="https://github.com/ramanathan23"
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'flex items-center gap-1 font-medium transition-colors',
            darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.495.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          GitHub
        </a>
        <span className={darkMode ? 'text-slate-600' : 'text-gray-300'} aria-hidden>
          •
        </span>
        <a
          href="mailto:c.ramanathan23@gmail.com"
          className={clsx(
            'flex items-center gap-1 font-medium transition-colors',
            darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact
        </a>
      </div>
    </footer>
  );
}
