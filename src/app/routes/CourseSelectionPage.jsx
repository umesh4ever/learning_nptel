import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { getCourse, getCoursePath } from '../../data/courseData.js'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function CourseSelectionPage() {
  const navigate = useNavigate()
  const { courses, selectCourse } = useStudyroom()

  const assignmentCourses = courses.filter((course) => course.isAssignment)
  const practiceCourses = courses.filter((course) => !course.isAssignment)
  const noteCourses = courses.filter((course) => !course.isAssignment)

  function handleSelectCourse(courseId) {
    const course = getCourse(courseId)
    if (!course) return
    const restoredState = selectCourse(course.id)
    if (!restoredState) return
    if (restoredState.finished) {
      navigate(getCoursePath(course.id, 'results'))
    } else if (restoredState.quiz) {
      navigate(getCoursePath(course.id, `quiz/${restoredState.currentQuestionIndex + 1}`))
    } else {
      navigate(getCoursePath(course.id))
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-14 pt-10 sm:px-8 sm:pt-12 lg:px-12">
      <section className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-(--c-1e3445) text-(--c-a7c6dc)">
          <Icon name="book" className="size-5" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--c-82aecb)">NPTEL Portal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--c-dce7ef) sm:text-4xl">
          Choose what you want to practice
        </h1>
        <p className="mt-2.5 text-sm leading-6 text-(--c-a2b2bf)">
          Select an assignment test, practice quiz, or review study notes. Everything is saved locally.
        </p>
      </section>

      {/* Section 1: Assignments */}
      <section aria-label="Assignments" className="mt-10">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-blue-500/20 text-blue-400">
            <Icon name="book" className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-blue-400 sm:text-lg">Assignments</h2>
            <p className="text-xs text-(--c-a2b2bf)">Official week-wise assignment question banks with answers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {assignmentCourses.map((course) => {
            const courseData = getCourse(course.id)
            const questionCount =
              courseData.questionCount ??
              courseData.weeks.reduce((total, week) => total + week.questions.length, 0) ??
              0
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => handleSelectCourse(course.id)}
                className="group flex flex-col justify-between rounded-xl border border-(--c-354958) bg-(--c-182633) p-5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition duration-150 hover:-translate-y-0.5 hover:border-(--c-6089a4) hover:bg-(--c-202f3c) hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9)"
              >
                <div>
                  <div className="flex w-full items-start justify-between gap-3">
                    <span className="grid size-9.5 shrink-0 place-items-center rounded-lg bg-blue-500/20 text-blue-400 transition-colors group-hover:bg-blue-500/30">
                      <Icon name="book" className="size-4.5" />
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                      {course.weeks.length} weeks
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-base font-semibold text-(--c-dce7ef)">{course.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--c-a2b2bf)">{course.description}</p>
                </div>
                <div className="mt-4 flex w-full items-center justify-between border-t border-blue-500/30 pt-3 text-xs font-semibold text-blue-400">
                  <span className="text-blue-400">{questionCount} questions</span>
                  <span className="transition-transform group-hover:translate-x-1 text-blue-300">Start test →</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Section 2: Notes based Practice Quiz */}
      <section aria-label="Notes based Practice Quiz" className="mt-10">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-purple-500/20 text-purple-400">
            <Icon name="grid" className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-purple-400 sm:text-lg">Notes based Practice Quiz</h2>
            <p className="text-xs text-(--c-a2b2bf)">Custom mock tests with difficulty levels, timer controls &amp; solutions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {practiceCourses.map((course) => {
            const courseData = getCourse(course.id)
            const questionCount =
              courseData.questionCount ??
              courseData.weeks.reduce((total, week) => total + week.questions.length, 0) ??
              0
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => handleSelectCourse(course.id)}
                className="group flex flex-col justify-between rounded-xl border border-(--c-354958) bg-(--c-182633) p-5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition duration-150 hover:-translate-y-0.5 hover:border-(--c-6089a4) hover:bg-(--c-202f3c) hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9)"
              >
                <div>
                  <div className="flex w-full items-start justify-between gap-3">
                    <span className="grid size-9.5 shrink-0 place-items-center rounded-lg bg-purple-500/20 text-purple-400 transition-colors group-hover:bg-purple-500/30">
                      <Icon name="grid" className="size-4.5" />
                    </span>
                    <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      {course.weeks.length} weeks
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-base font-semibold text-(--c-dce7ef)">{course.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--c-a2b2bf)">{course.description}</p>
                </div>
                <div className="mt-4 flex w-full items-center justify-between border-t border-purple-500/30 pt-3 text-xs font-semibold text-purple-400">
                  <span className="text-purple-400">{questionCount} questions</span>
                  <span className="transition-transform group-hover:translate-x-1 text-purple-300">Start test →</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Section 3: Notes */}
      <section aria-label="Notes" className="mt-10">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-amber-500/20 text-amber-400">
            <Icon name="notes" className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-amber-400 sm:text-lg">Notes</h2>
            <p className="text-xs text-(--c-a2b2bf)">Week-by-week study summaries built from question explanations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {noteCourses.map((course) => (
            <Link
              key={course.id}
              to={getCoursePath(course.id, 'notes')}
              className="group flex flex-col justify-between rounded-xl border border-(--c-354958) bg-(--c-182633) p-5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition duration-150 hover:-translate-y-0.5 hover:border-(--c-6089a4) hover:bg-(--c-202f3c) hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9)"
            >
              <div>
                <div className="flex w-full items-start justify-between gap-3">
                  <span className="grid size-9.5 shrink-0 place-items-center rounded-lg bg-amber-500/20 text-amber-400 transition-colors group-hover:bg-amber-500/30">
                    <Icon name="notes" className="size-4.5" />
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {course.weeks.length} weeks
                  </span>
                </div>
                <h3 className="mt-3.5 text-base font-semibold text-(--c-dce7ef)">{course.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--c-a2b2bf)">
                  Week-by-week study notes from question explanations and justifications.
                </p>
              </div>
              <div className="mt-4 flex w-full items-center justify-between border-t border-amber-500/30 pt-3 text-xs font-semibold text-amber-400">
                <span className="text-amber-400">Full syllabus notes</span>
                <span className="transition-transform group-hover:translate-x-1 text-amber-300">Read notes →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
