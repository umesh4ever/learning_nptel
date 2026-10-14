import { Navigate } from 'react-router-dom'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'
import { getCoursePath } from '../../data/courseData.js'

export default function RouteFallback() {
  const { state } = useStudyroom()
  if (!state.courseId) return <Navigate to="/" replace />
  if (state.finished) return <Navigate to={getCoursePath(state.courseId, 'results')} replace />
  if (state.quiz) {
    return <Navigate to={getCoursePath(state.courseId, `quiz/${state.currentQuestionIndex + 1}`)} replace />
  }
  return <Navigate to={getCoursePath(state.courseId)} replace />
}
