import { useNavigate } from 'react-router-dom'
import WeekSelectionStep from '../../features/setup/WeekSelectionStep.jsx'
import { weeks } from '../../data/courseData.js'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function WeekSetupRoute() {
  const { state, dispatch } = useStudyroom()
  const navigate = useNavigate()
  return (
    <WeekSelectionStep
      weeks={weeks}
      selectedWeeks={state.selectedWeeks}
      onToggleWeek={(week) => dispatch({ type: 'toggle-week', week })}
      onReset={() => dispatch({ type: 'reset-weeks' })}
      onCompletePaper={() => {
        dispatch({ type: 'complete-paper' })
        navigate('/setup/paper')
      }}
      onContinue={() => navigate('/setup/paper')}
    />
  )
}
