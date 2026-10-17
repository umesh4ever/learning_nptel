import { Navigate, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { getCourse, getCoursePath } from '../../data/courseData.js'
import { useStudyroom } from '../studyroom/StudyroomContext.js'

export default function WeekSelectionPage() {
  const { state, dispatch } = useStudyroom()
  const navigate = useNavigate()
  const course = getCourse(state.courseId)

  if (!course) return <Navigate to="/" replace />

  const { weeks, isAssignment, name: courseName } = course
  const selectedWeeks = state.selectedWeeks
  const selectedWeekNumbers = new Set(selectedWeeks.map((week) => week.week))
  const completePaperQuestionCount = isAssignment
    ? weeks.reduce((total, week) => total + week.questions.length, 0)
    : weeks.length

  function onToggleWeek(week) { dispatch({ type: 'toggle-week', week }) }
  function onReset() { dispatch({ type: 'reset-weeks' }) }
  function onCompletePaper() {
    dispatch({ type: 'complete-paper' })
    navigate(getCoursePath(course.id, 'setup/paper'))
  }
  function onContinue() { navigate(getCoursePath(course.id, 'setup/paper')) }

  return (
    <main className="mx-auto w-full max-w-295 px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <section className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-(--c-1e3445) px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--c-a7c6dc)">
          <Icon name="book" className="size-3.5" />
          Practice at your pace
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.055em] text-(--c-dce7ef) sm:text-[48px] sm:leading-[1.08]">{courseName}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-(--c-a2b2bf) sm:text-base">
              {isAssignment
                ? 'Select one or more assignment weeks. Every question from each selected week will be included.'
                : 'Select one or more weeks to build your test.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-(--c-394c5b) bg-(--c-1a2936) px-3 text-xs font-bold text-(--c-bdcbd5) transition-transform hover:bg-(--c-243746) active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) sm:min-h-10 sm:min-w-0"
          >
            <Icon name="reset" className="size-4" />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-(--c-2b3b49) bg-(--c-182633) p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-(--c-91a4b3)">Step 01</p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-(--c-d6e1e9)">Choose weeks</h2>
          </div>
          <p className="pb-1 text-xs font-medium text-(--c-9aabba)">{selectedWeeks.length} selected</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
          {weeks.map((week) => {
            const active = selectedWeekNumbers.has(week.week)
            return (
              <button
                key={week.week}
                type="button"
                onClick={() => onToggleWeek(week)}
                aria-pressed={active}
                aria-label={`${active ? 'Deselect' : 'Select'} Week ${week.week}`}
                className={`min-h-24.5 rounded-xl border p-3 text-left transition-colors duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-356da8) disabled:cursor-not-allowed ${
                  active
                    ? 'border-(--c-39708f) bg-(--c-24516d) text-white shadow-[0_6px_16px_rgba(0,0,0,0.22)] hover:bg-(--c-2c6383)'
                    : 'border-(--c-354958) bg-(--c-202f3c) text-(--c-c3d0da) hover:border-(--c-52738a) hover:bg-(--c-293d4d) hover:shadow-[0_6px_15px_rgba(0,0,0,0.2)]'
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${active ? 'text-(--c-c8dfed)' : 'text-(--c-98aab8)'}`}>Week {String(week.week).padStart(2, '0')}</span>
                  {active && <Icon name="check" className="size-4 text-(--c-d9eafa)" />}
                </span>
                <span className="mt-2 block line-clamp-2 text-xs font-semibold leading-[1.45]">{week.topic_title}</span>
                <span className={`mt-2 block text-[10px] ${active ? 'text-white/75' : 'text-(--c-9aabba)'}`}>{week.questions.length} questions</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onCompletePaper}
          className="complete-paper-card relative isolate mt-4 flex w-full items-center justify-between gap-4 rounded-xl border border-(--c-3b5b72) bg-(--c-20384a) p-4 text-left transition-colors duration-150 hover:bg-(--c-29485e) hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) sm:px-5"
        >
          <span className="relative z-10 min-w-0">
            <span className="block text-base font-extrabold text-(--c-dce7ef)">Complete paper</span>
            <span className="mt-1 block text-xs leading-5 text-(--c-a9bac7)">
              {isAssignment
                ? `All ${weeks.length} weeks · all questions · ${completePaperQuestionCount} total`
                : `All ${weeks.length} weeks · mixed questions · ${completePaperQuestionCount} questions total`}
            </span>
          </span>
          <span className="relative z-10 shrink-0 rounded-lg bg-(--c-315a75) px-3 py-2 text-xs font-bold text-(--c-e0ebf2) shadow-sm">Start setup →</span>
        </button>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-(--c-2d3e4b) pt-4 sm:flex-row sm:justify-between sm:border-(--c-2d3e4b) sm:pt-5">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--c-394c5b) bg-(--c-202f3c) px-4 text-sm font-bold text-(--c-bdcbd5) transition-transform hover:bg-(--c-293d4d) active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) sm:min-h-10 sm:w-auto"
          >
            <Icon name="reset" className="size-4" />
            Reset selection
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={selectedWeeks.length === 0}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--c-2d6485) px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.24)] transition-transform hover:bg-(--c-39799d) active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-10 sm:w-auto"
          >
            Continue to paper setup
            <Icon name="arrow" className="size-4.5" />
          </button>
        </div>
      </section>
    </main>
  )
}

