import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ResultsScreen from './ResultsScreen.jsx'
import { useStudyroom } from '../studyroom/StudyroomContext.js'
import { getCoursePath, quizModes } from '../../data/courseData.js'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { state, dispatch } = useStudyroom()
  const { quiz, finished, quizMode } = state

  // Learning quizzes do not have a results screen; they end at LearningQuizEnd
  if (quizMode === quizModes.learning) {
    return <Navigate to={getCoursePath(courseId)} replace />
  }

  if (!quiz) return <Navigate to={getCoursePath(courseId)} replace />
  if (!finished) {
    return <Navigate to={getCoursePath(courseId, `quiz/${state.currentQuestionIndex + 1}`)} replace />
  }

  const correctCount = quiz.questions.filter(
    (question) => answers[question.id] === question.correct_answer,
  ).length
  const durationSeconds = Math.max(
    0,
    Math.floor(((quiz.completedAt ?? quiz.endsAt) - quiz.startedAt) / 1000),
  )

  const { selectedAnswers: answers } = state

  function createNewTest() {
    dispatch({ type: 'return-to-setup' })
    navigate(getCoursePath(courseId))
  }

  return (
    <ResultsScreen
      quiz={quiz}
      selectedAnswers={answers}
      correctCount={correctCount}
      durationSeconds={durationSeconds}
      onCreateTest={createNewTest}
    />
  )
}
