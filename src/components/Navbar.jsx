import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function Navbar({ quiz, questionIndex, finished, onGoHome }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#0f314b] bg-[#163b59] px-3 py-1.5 text-white shadow-md sm:px-6 sm:py-2 lg:px-10">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-[1180px] items-center justify-between gap-3">
        <Link
          to="/setup/weeks"
          onClick={onGoHome}
          className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ddf5] sm:min-h-10"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#b9ddf5] text-[#163b59]">
            <Icon name="book" className="size-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight text-white">NPTEL Quizzz</span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:block">practice</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <Link
            to="/setup/weeks"
            onClick={onGoHome}
            className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-bold text-white/85 transition-all hover:bg-white/15 hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ddf5] sm:min-h-10"
          >
            <span className="sm:hidden">Home</span>
            <span className="hidden sm:inline">Weekly tests</span>
          </Link>
          {quiz && !finished && (
            <Link
              to={`/quiz/${questionIndex + 1}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#b9ddf5] px-3 py-2 text-xs font-bold text-[#163b59] transition-all hover:bg-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-10"
            >
              <span className="sm:hidden">Resume</span>
              <span className="hidden sm:inline">Resume test</span>
              <Icon name="arrow" className="size-3.5" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
