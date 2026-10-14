import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function Navbar({ quiz, questionIndex, finished, onGoHome, theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#243b4c] bg-[#142536] px-3 py-1.5 text-[#dce7ef] shadow-md sm:px-6 sm:py-2 lg:px-10">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-295 items-center justify-between gap-3">
        <Link
          to="/setup/weeks"
          onClick={onGoHome}
          className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ddf5] sm:min-h-10"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#315a75] text-[#dceaf3]">
            <Icon name="book" className="size-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xl font-bold tracking-tight text-[#e3edf4]">NPTEL Quizzz</span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9aabba] sm:block">practice</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            to="/setup/weeks"
            onClick={onGoHome}
            className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-bold text-[#c1cfda] transition-all hover:bg-[#25394a] hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78a9c9] sm:min-h-10"
          >
            <span className="sm:hidden text-xl">Home</span>
            <span className="hidden sm:inline">Weekly tests</span>
          </Link>
          {quiz && !finished && (
            <Link
              to={`/quiz/${questionIndex + 1}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#315a75] px-3 py-2 text-xs font-bold text-[#e3edf4] transition-all hover:bg-[#3a698a] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ac4df] sm:min-h-10"
            >
              <span className="sm:hidden">Resume</span>
              <span className="hidden sm:inline">Resume test</span>
              <Icon name="arrow" className="size-3.5" />
            </Link>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="grid size-11 place-items-center rounded-lg text-[#c1cfda] transition-colors hover:bg-[#25394a] hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78a9c9] sm:size-10"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="size-5" />
          </button>
        </div>
      </nav>
    </header>
  )
}
