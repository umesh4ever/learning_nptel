import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { getCoursePath } from '../../data/courseData.js'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function CourseSelectionPage() {
  const navigate = useNavigate()
  const { courses, selectCourse } = useStudyroom()

  function handleSelectCourse(course) {
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
    <main className="mx-auto w-full max-w-5xl px-5 pb-12 pt-12 sm:px-8 sm:pt-16 lg:px-12">
      <section className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-(--c-1e3445) text-(--c-a7c6dc)">
          <Icon name="book" className="size-6" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--c-82aecb)">NPTEL practice</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-(--c-dce7ef) sm:text-4xl">
          Choose your course
        </h1>
        <p className="mt-3 text-sm leading-6 text-(--c-a2b2bf) sm:text-base">
          Select a course to build a weekly or complete practice paper. Your progress is saved separately for each course.
        </p>
      </section>

      <section aria-label="Available courses" className="mx-auto mt-9 grid max-w-4xl gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const questionCount = course.weeks.reduce(
            (total, week) => total + week.questions.length,
            0,
          )

          return (
            <button
              key={course.id}
              type="button"
              onClick={() => handleSelectCourse(course)}
              className="group flex min-h-52 flex-col rounded-2xl border border-(--c-354958) bg-(--c-182633) p-5 text-left shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-1 hover:border-(--c-6089a4) hover:bg-(--c-202f3c) hover:shadow-[0_16px_35px_rgba(0,0,0,0.24)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) sm:p-6"
            >
              <span className="flex w-full items-start justify-between gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-(--c-203d52) text-(--c-c8dfed) transition-colors group-hover:bg-(--c-2d6485)">
                  <Icon name="book" className="size-5" />
                </span>
                <span className="rounded-full bg-(--c-202f3c) px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-(--c-a9bac7)">
                  {course.weeks.length} weeks
                </span>
              </span>
              <span className="mt-5 block text-lg font-semibold leading-6 text-(--c-dce7ef)">{course.name}</span>
              <span className="mt-2 block flex-1 text-sm leading-5 text-(--c-a2b2bf)">{course.description}</span>
              <span className="mt-5 flex w-full items-center justify-between border-t border-(--c-2b3b49) pt-4 text-xs font-semibold text-(--c-a7c6dc)">
                <span>{questionCount} practice questions</span>
                <span className="transition-transform group-hover:translate-x-1">Select course →</span>
              </span>
            </button>
          )
        })}
      </section>
    </main>
  )
}
