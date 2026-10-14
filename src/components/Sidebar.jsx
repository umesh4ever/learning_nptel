import Icon from './Icon.jsx'
import { Link } from 'react-router-dom'
import { getCoursePath } from '../data/courseData.js'

export default function Sidebar({
  course,
  quiz,
  answeredCount,
  progress,
  currentQuestionIndex,
  finished,
}) {
  const weeks = course.weeks
  const courseQuestionCount = weeks.reduce((total, week) => total + week.questions.length, 0)

  return (
    <aside className="hidden h-screen w-[250px] min-w-[250px] shrink-0 flex-col overflow-x-hidden overflow-y-auto bg-[#142536] px-5 py-6 text-[#dce7ef] md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:px-5 lg:px-6">
      <Link
        to="/"
        className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ddf5]"
      >
        <div className="grid size-10 place-items-center rounded-xl bg-[#315a75] text-[#e0ebf2]">
          <Icon name="book" className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight">NPTEL Quizzz</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#8fa3b3]">practice</p>
        </div>
      </Link>

      <div className="mt-10">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8498a8]">Workspace</p>
        <Link
          to={getCoursePath(course.id)}
          className="flex w-full items-center gap-3 rounded-xl bg-[#20384a] px-3 py-3 text-left text-sm font-semibold transition hover:bg-[#29475d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78a9c9]"
        >
          <Icon name="grid" className="size-4.5 text-[#9bc3dd]" />
          Weekly tests
        </Link>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8498a8]">Your course</p>
        <Link
          to="/"
          className="block w-full min-w-0 shrink-0 box-border break-words rounded-xl border border-[#344958] p-3 text-left transition [overflow-wrap:anywhere] hover:border-[#4b6679] hover:bg-[#1b3040] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78a9c9]"
        >
          <span className="block text-xs font-semibold leading-5 text-[#dce7ef]">{course.name}</span>
          <span className="mt-2 block text-[11px] text-[#a2b2bf]">{weeks.length} weeks · {courseQuestionCount} questions</span>
        </Link>
        {quiz && !finished && (
          <div className="mt-5 shrink-0 rounded-xl bg-[#1b3040] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8498a8]">Current test</p>
            <p className="mt-2 text-xs font-semibold">{quiz.weeks.map((week) => week.week).join(', ')}</p>
            <p className="mt-1 text-[11px] text-[#a2b2bf]">{answeredCount} of {quiz.questions.length} answered</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#344958]">
              <div className="h-full rounded-full bg-[#78a9c9] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <Link
              to={getCoursePath(course.id, `quiz/${currentQuestionIndex + 1}`)}
              className="mt-3 inline-block text-[11px] font-bold text-[#9bc3dd] hover:text-white"
            >
              Resume test
            </Link>
          </div>
        )}
      </div>

      <Link
        to="/"
        className="mt-6 flex shrink-0 items-center gap-3 border-t border-[#344958] pt-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78a9c9]"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#29475d] text-xs font-bold text-[#a8cce2]">N</span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold">Keep learning</span>
          
        </span>
      </Link>
    </aside>
  )
}
