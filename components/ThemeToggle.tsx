'use client';

type ThemeToggleProps = {
  darkMode: boolean;
  onToggle: () => void;
};

export default function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={onToggle}
      className={`group fixed right-6 top-6 z-20 rounded-2xl p-3 backdrop-blur-md shadow-xl transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        darkMode
          ? 'border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 focus-visible:ring-amber-400'
          : 'border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-600 focus-visible:ring-indigo-500'
      }`}
    >
      <div className="relative">
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
