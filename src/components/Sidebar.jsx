import Icon from './Icon.jsx'
import { Link } from 'react-router-dom'

export default function Sidebar({
  weeks,
  quiz,
  answeredCount,
  progress,
  currentQuestionIndex,
  finished,
  onGoToSetup,
}) {
  const courseQuestionCount = weeks.reduce((total, week) => total + week.questions.length, 0)

  return (
    <aside className="hidden h-screen w-[250px] min-w-[250px] shrink-0 flex-col overflow-x-hidden overflow-y-auto bg-[#163b59] px-5 py-6 text-white md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:px-5 lg:px-6">
      <Link
        to="/setup/weeks"
        onClick={onGoToSetup}
        className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ddf5]"
      >
        <div className="grid size-10 place-items-center rounded-xl bg-[#d9eafa] text-[#245984]">
          <Icon name="book" className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight">NPTEL Quizzz</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-white/45">practice</p>
        </div>
      </Link>

      <div className="mt-10">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Workspace</p>
        <Link
          to="/setup/weeks"
          onClick={onGoToSetup}
          className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-left text-sm font-semibold transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ddf5]"
        >
          <Icon name="grid" className="size-[18px] text-[#b9ddf5]" />
          Weekly tests
        </Link>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Your course</p>
        <Link
          to="/setup/weeks"
          onClick={onGoToSetup}
          className="block w-full min-w-0 shrink-0 box-border break-words rounded-xl border border-white/15 p-3 text-left transition [overflow-wrap:anywhere] hover:border-white/30 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ddf5]"
        >
          <span className="block text-xs font-semibold leading-5 text-white/90">Industry 4.0 &amp; Industrial IoT</span>
          <span className="mt-2 block text-[11px] text-white/60">{weeks.length} weeks · {courseQuestionCount} questions</span>
        </Link>
        {quiz && !finished && (
          <div className="mt-5 shrink-0 rounded-xl bg-white/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Current test</p>
            <p className="mt-2 text-xs font-semibold">{quiz.weeks.map((week) => week.week).join(', ')}</p>
            <p className="mt-1 text-[11px] text-white/50">{answeredCount} of {quiz.questions.length} answered</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#b9ddf5] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <Link
              to={`/quiz/${currentQuestionIndex + 1}`}
              className="mt-3 inline-block text-[11px] font-bold text-[#b9ddf5] hover:text-white"
            >
              Resume test
            </Link>
          </div>
        )}
      </div>

      <Link
        to="/setup/weeks"
        onClick={onGoToSetup}
        className="mt-6 flex shrink-0 items-center gap-3 border-t border-white/10 pt-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ddf5]"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#285575] text-xs font-bold text-[#b9ddf5]">N</span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold">Keep learning</span>
          
        </span>
      </Link>
    </aside>
  )
}
