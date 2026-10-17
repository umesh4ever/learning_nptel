import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { getCourse, getCoursePath } from '../data/courseData.js'
import { useStudyroom } from '../features/studyroom/StudyroomContext.js'

export default function Sidebar({
  quiz,
  answeredCount,
  progress,
  currentQuestionIndex,
  finished,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const { courses, selectCourse, state } = useStudyroom()

  const assignmentCourses = courses.filter((c) => c.isAssignment)
  const practiceCourses = courses.filter((c) => !c.isAssignment)
  const noteCourses = courses.filter((c) => !c.isAssignment)

  const isNotesRoute = location.pathname.includes('/notes')
  const currentPath = location.pathname

  function handleCourseClick(courseId) {
    const course = getCourse(courseId)
    if (!course) return
    const restoredState = selectCourse(course.id)
    if (!restoredState) return
    if (restoredState.finished) {
      navigate(getCoursePath(course.id, 'results'))
    } else if (restoredState.quiz) {
      navigate(getCoursePath(course.id, `quiz/${restoredState.currentQuestionIndex + 1}`))
    } else {
      navigate(getCoursePath(course.id, 'setup/weeks'))
    }
  }

  function handleNotesClick(courseId) {
    navigate(getCoursePath(courseId, 'notes'))
  }

  return (
    <aside
      aria-label="Application navigation"
      className="hidden h-screen w-72 shrink-0 flex-col overflow-y-auto bg-[#142536] px-5 py-6 text-[#dce7ef] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex"
    >
      <Link
        to="/"
        className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ddf5]"
      >
        <div className="grid size-10 place-items-center rounded-xl bg-[#315a75] text-[#e0ebf2] shadow-sm">
          <Icon name="book" className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight text-white">NPTEL Quizzz</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8fa3b3]">Portal</p>
        </div>
      </Link>

      <nav aria-label="Portal sections" className="mt-7 flex flex-1 flex-col gap-6">
        {/* Section 1: Assignments */}
        <div>
          <p className="mb-2.5 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3b3]">
            Assignments
          </p>
          <div className="space-y-1.5">
            {assignmentCourses.map((c) => {
              const isActive = !isNotesRoute && currentPath.includes(`/courses/${c.id}`)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCourseClick(c.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-lg border px-3 py-2.5 text-left transition duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'border-[#6089a4] bg-[#20384a] text-white shadow-sm'
                      : 'border-[#263b4a] bg-[#182a3a]/60 text-[#c3d0da] hover:border-[#466982] hover:bg-[#1e3448] hover:text-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{c.name}</span>
                    <span className="mt-0.5 block text-[10px] text-[#91a4b3]">
                      {c.weeks.length} assignments
                    </span>
                  </div>
                  <Icon name="arrow" className={`size-3 shrink-0 ${isActive ? 'text-[#a7c6dc]' : 'text-[#627a8c]'}`} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 2: Notes based Practice Quiz */}
        <div>
          <p className="mb-2.5 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3b3]">
            Practice Quizzes
          </p>
          <div className="space-y-1.5">
            {practiceCourses.map((c) => {
              const isActive = !isNotesRoute && currentPath.includes(`/courses/${c.id}`)
              const totalQ = c.weeks.reduce((total, week) => total + week.questions.length, 0)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCourseClick(c.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-lg border px-3 py-2.5 text-left transition duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'border-[#6089a4] bg-[#20384a] text-white shadow-sm'
                      : 'border-[#263b4a] bg-[#182a3a]/60 text-[#c3d0da] hover:border-[#466982] hover:bg-[#1e3448] hover:text-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{c.name}</span>
                    <span className="mt-0.5 block text-[10px] text-[#91a4b3]">
                      {c.weeks.length} wks · {totalQ} Qs
                    </span>
                  </div>
                  <Icon name="arrow" className={`size-3 shrink-0 ${isActive ? 'text-[#a7c6dc]' : 'text-[#627a8c]'}`} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 3: Notes */}
        <div>
          <p className="mb-2.5 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3b3]">
            Study Notes
          </p>
          <div className="space-y-1.5">
            {noteCourses.map((c) => {
              const isActive = isNotesRoute && currentPath.includes(`/courses/${c.id}`)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleNotesClick(c.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-lg border px-3 py-2.5 text-left transition duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'border-[#6089a4] bg-[#20384a] text-white shadow-sm'
                      : 'border-[#263b4a] bg-[#182a3a]/60 text-[#c3d0da] hover:border-[#466982] hover:bg-[#1e3448] hover:text-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{c.name}</span>
                    <span className="mt-0.5 block text-[10px] text-[#91a4b3]">
                      {c.weeks.length} weekly notes
                    </span>
                  </div>
                  <Icon name="notes" className={`size-3.5 shrink-0 ${isActive ? 'text-[#a7c6dc]' : 'text-[#627a8c]'}`} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Test Status */}
        {quiz && !finished && (
          <div className="mt-auto shrink-0 rounded-xl border border-[#3b5b72] bg-[#1b3040] p-3.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8fa3b3]">Active test</p>
            <p className="mt-1.5 text-xs font-semibold text-white">
              {quiz.weeks.map((w) => `W${w.week}`).join(', ')}
            </p>
            <p className="mt-0.5 text-[11px] text-[#a2b2bf]">
              {answeredCount} of {quiz.questions.length} answered
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#2a4358]">
              <div className="h-full rounded-full bg-[#78a9c9] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <Link
              to={getCoursePath(state.courseId, `quiz/${currentQuestionIndex + 1}`)}
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#9bc3dd] hover:text-white"
            >
              Resume test →
            </Link>
          </div>
        )}
      </nav>

      <Link
        to="/"
        className="mt-6 flex shrink-0 items-center gap-2.5 border-t border-[#263b4a] pt-4 text-xs font-semibold text-[#91a4b3] hover:text-white"
      >
        <span className="grid size-6 place-items-center rounded bg-[#20384a] text-[10px] font-bold text-[#a7c6dc]">
          ⌂
        </span>
        <span>Back to homepage</span>
      </Link>
    </aside>
  )
}
