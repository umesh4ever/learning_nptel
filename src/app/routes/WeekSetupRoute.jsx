import { Navigate, useNavigate } from 'react-router-dom'
import WeekSelectionStep from '../../features/setup/WeekSelectionStep.jsx'
import { getCourse, getCoursePath } from '../../data/courseData.js'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function WeekSetupRoute() {
  const { state, dispatch } = useStudyroom()
  const navigate = useNavigate()
  const course = getCourse(state.courseId)

  if (!course) return <Navigate to="/" replace />

  return (
    <WeekSelectionStep
      courseName={course.name}
      weeks={course.weeks}
      selectedWeeks={state.selectedWeeks}
      onToggleWeek={(week) => dispatch({ type: 'toggle-week', week })}
      onReset={() => dispatch({ type: 'reset-weeks' })}
      onCompletePaper={() => {
        dispatch({ type: 'complete-paper' })
        navigate(getCoursePath(course.id, 'setup/paper'))
      }}
      onContinue={() => navigate(getCoursePath(course.id, 'setup/paper'))}
    />
  )
}
