import { Navigate, useNavigate } from 'react-router-dom'
import ResultsScreen from './ResultsScreen.jsx'
import { useStudyroom } from '../studyroom/StudyroomContext.js'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useStudyroom()
  const { quiz, selectedAnswers, finished } = state

  if (!quiz) return <Navigate to="/setup/weeks" replace />
  if (!finished) return <Navigate to={`/quiz/${state.currentQuestionIndex + 1}`} replace />

  const correctCount = quiz.questions.filter(
    (question) => selectedAnswers[question.id] === question.correct_answer,
  ).length
  const durationSeconds = Math.max(
    0,
    Math.floor(((quiz.completedAt ?? quiz.endsAt) - quiz.startedAt) / 1000),
  )

  function createNewTest() {
    dispatch({ type: 'return-to-setup' })
    navigate('/setup/weeks')
  }

  return (
    <ResultsScreen
      quiz={quiz}
      selectedAnswers={selectedAnswers}
      correctCount={correctCount}
      durationSeconds={durationSeconds}
      onCreateTest={createNewTest}
    />
  )
}
