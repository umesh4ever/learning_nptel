import { Navigate } from 'react-router-dom'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function RouteFallback() {
  const { state } = useStudyroom()
  if (state.finished) return <Navigate to="/results" replace />
  if (state.quiz) return <Navigate to={`/quiz/${state.currentQuestionIndex + 1}`} replace />
  return <Navigate to="/setup/weeks" replace />
}
