import { useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { getCourse } from '../../data/courseData.js'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function CourseRoute() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { state, selectCourse } = useStudyroom()

  useEffect(() => {
    if (course && state.courseId !== course.id) selectCourse(course.id)
  }, [course, selectCourse, state.courseId])

  if (!course) return <Navigate to="/" replace />
  if (state.courseId !== course.id) {
    return (
      <main className="grid min-h-[50vh] place-items-center text-sm font-semibold text-(--c-a2b2bf)">
        Loading course…
      </main>
    )
  }

  return <Outlet />
}
