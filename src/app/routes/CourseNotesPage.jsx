import { Link, Navigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { getCourse, getCoursePath, getWeekNotes } from '../../data/courseData.js'

export default function CourseNotesPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)

  if (!course) return <Navigate to="/" replace />
  if (course.id !== 'iiot-4.0') return <Navigate to={getCoursePath(course.id)} replace />

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <header className="mb-7">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-(--c-82aecb)">
          <Icon name="notes" className="size-4" />
          Notes
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--c-dce7ef) sm:text-4xl">
          {course.name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-(--c-a2b2bf)">
          Select a week to open its notes document, organized by topic and built from the question explanations.
        </p>
      </header>

      <section
        aria-label="Weekly notes"
        className="overflow-hidden rounded-xl border border-(--c-394c5b) bg-(--c-182633) shadow-[0_12px_35px_rgba(0,0,0,0.16)]"
      >
        <div className="flex items-center gap-3 border-b border-(--c-2b3b49) bg-(--c-202f3c) px-4 py-3 sm:px-6">
          <Icon name="book" className="size-4 text-(--c-82aecb)" />
          <span className="text-xs font-bold uppercase tracking-[0.13em] text-(--c-a9bac7)">Contents</span>
          <span className="ml-auto text-[11px] text-(--c-9aabba)">{course.weeks.length} weeks</span>
        </div>
        <ol className="divide-y divide-(--c-2b3b49)">
          {course.weeks.map((week) => {
            const topics = getWeekNotes(week)
            const noteCount = topics.reduce((total, topic) => total + topic.notes.length, 0)

            return (
              <li key={week.week}>
                <Link
                  to={getCoursePath(course.id, `notes/week/${week.week}`)}
                  className="group flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-(--c-202f3c) focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-(--c-78a9c9) sm:gap-4 sm:px-6"
                >
                  <Icon name="notes" className="size-4 shrink-0 text-(--c-82aecb)" />
                  <span className="w-16 shrink-0 text-[11px] font-semibold tabular-nums text-(--c-9aabba)">
                    Week {String(week.week).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-5 text-(--c-dce7ef) group-hover:text-(--c-a7c6dc)">
                      {week.topic_title}
                    </span>
                    <span className="mt-1 block text-[11px] text-(--c-9aabba)">
                      {topics.length} topics · {noteCount} notes
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-(--c-a7c6dc)">Open →</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}
