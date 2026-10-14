import { Navigate, useNavigate } from 'react-router-dom'
import PaperSetupStep from '../../features/setup/PaperSetupStep.jsx'
import { getCoursePath, getMaxTestQuestionCount } from '../../data/courseData.js'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function PaperSetupRoute() {
  const { state, dispatch } = useStudyroom()
  const navigate = useNavigate()
  if (state.selectedWeeks.length === 0) {
    return <Navigate to={getCoursePath(state.courseId)} replace />
  }

  return (
    <PaperSetupStep
      selectedWeeks={state.selectedWeeks}
      difficulty={state.difficulty}
      questionCount={state.questionCount}
      durationMinutes={state.durationMinutes}
      onDifficultyChange={(difficulty) => dispatch({ type: 'set-difficulty', difficulty })}
      onQuestionCountChange={(count) => dispatch({ type: 'set-question-count', count })}
      onDurationChange={(minutes) => dispatch({ type: 'set-duration', minutes })}
      onBack={() => navigate(getCoursePath(state.courseId))}
      onReset={() => dispatch({ type: 'reset-paper' })}
      onStart={() => {
        const questionCount = Number(state.questionCount)
        const durationMinutes = Number(state.durationMinutes)
        const maxQuestionCount = getMaxTestQuestionCount(state.selectedWeeks, state.difficulty)
        if (
          !Number.isInteger(questionCount) ||
          questionCount < state.selectedWeeks.length ||
          questionCount > maxQuestionCount ||
          questionCount % state.selectedWeeks.length !== 0 ||
          !Number.isInteger(durationMinutes) ||
          durationMinutes < 5 ||
          durationMinutes % 5 !== 0
        ) return

        dispatch({ type: 'start-quiz', questionCount, durationMinutes })
        navigate(getCoursePath(state.courseId, 'quiz/1'))
      }}
    />
  )
}
