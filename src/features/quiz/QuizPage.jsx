import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import QuizScreen from './QuizScreen.jsx'
import { useStudyroom } from '../studyroom/StudyroomContext.js'

function getSecondsRemaining(endsAt) {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
}

export default function QuizPage() {
  const { questionNumber } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useStudyroom()
  const { quiz, currentQuestionIndex, selectedAnswers, finished } = state
  const routeIndex = Number(questionNumber) - 1
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    quiz ? getSecondsRemaining(quiz.endsAt) : 0,
  )

  useEffect(() => {
    if (!quiz) return undefined

    const updateTimer = () => setRemainingSeconds(getSecondsRemaining(quiz.endsAt))
    updateTimer()
    const timer = window.setInterval(updateTimer, 1000)
    return () => window.clearInterval(timer)
  }, [quiz])

  useEffect(() => {
    if (!quiz || finished || !Number.isInteger(routeIndex)) return
    if (routeIndex < 0 || routeIndex >= quiz.questions.length) {
      navigate(`/quiz/${currentQuestionIndex + 1}`, { replace: true })
      return
    }
    if (routeIndex !== currentQuestionIndex) {
      dispatch({ type: 'set-current-question', index: routeIndex })
    }
  }, [currentQuestionIndex, dispatch, finished, navigate, quiz, routeIndex])

  if (!quiz) return <Navigate to="/setup/weeks" replace />
  if (finished) return <Navigate to="/results" replace />
  if (!Number.isInteger(routeIndex) || routeIndex < 0 || routeIndex >= quiz.questions.length) {
    return <Navigate to={`/quiz/${currentQuestionIndex + 1}`} replace />
  }

  const answeredCount = quiz.questions.filter(
    (question) => selectedAnswers[question.id] !== undefined,
  ).length
  const progress = (answeredCount / quiz.questions.length) * 100
  const timeExpired = remainingSeconds === 0

  function changeQuestion(index) {
    if (index < 0 || index >= quiz.questions.length) return
    dispatch({ type: 'set-current-question', index })
    navigate(`/quiz/${index + 1}`)
  }

  function answerQuestion(questionId, answer) {
    if (timeExpired) return
    dispatch({ type: 'save-answer', questionId, answer, questionIndex: routeIndex })
    if (routeIndex < quiz.questions.length - 1) {
      navigate(`/quiz/${routeIndex + 2}`)
    }
  }

  return (
    <QuizScreen
      quiz={quiz}
      questionIndex={routeIndex}
      selectedAnswers={selectedAnswers}
      answeredCount={answeredCount}
      progress={progress}
      remainingSeconds={remainingSeconds}
      timeExpired={timeExpired}
      onAnswer={answerQuestion}
      onQuestionChange={changeQuestion}
      onSubmit={() => dispatch({ type: 'submit-quiz' })}
      onQuit={() => {
        dispatch({ type: 'return-to-setup' })
        navigate('/setup/weeks')
      }}
    />
  )
}
