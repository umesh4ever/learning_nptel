import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useStudyroom } from '../features/studyroom/StudyroomContext.js'
import { weeks } from '../data/courseData.js'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch, persistenceWarning } = useStudyroom()
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const { quiz, currentQuestionIndex, selectedAnswers } = state
  const answeredCount = quiz
    ? quiz.questions.filter((question) => selectedAnswers[question.id] !== undefined).length
    : 0
  const progress = quiz ? (answeredCount / quiz.questions.length) * 100 : 0
  const inActiveQuiz = Boolean(quiz && !state.finished && location.pathname.startsWith('/quiz/'))

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  function goToSetup() {
    dispatch({ type: 'return-to-setup' })
    navigate('/setup/weeks')
  }

  return (
    <div className="min-h-screen bg-[#eaf2f8] font-sans text-[#263d50]">
      {!inActiveQuiz && (
        <Sidebar
          weeks={weeks}
          quiz={quiz}
          answeredCount={answeredCount}
          progress={progress}
          currentQuestionIndex={currentQuestionIndex}
          finished={state.finished}
          onGoToSetup={goToSetup}
        />
      )}
      <div className={`min-h-screen ${inActiveQuiz ? '' : 'md:ml-[250px]'}`}>
        {persistenceWarning && (
          <p role="status" className="bg-[#fff4e5] px-5 py-3 text-center text-xs font-semibold text-[#80551b]">
            {persistenceWarning}
          </p>
        )}
        {!isOnline && (
          <p role="status" className="bg-[#fff4e5] px-5 py-3 text-center text-xs font-semibold text-[#80551b]">
            You are offline. Your saved test can continue on this device.
          </p>
        )}
        {!inActiveQuiz && (
          <Navbar
            quiz={quiz}
            questionIndex={currentQuestionIndex}
            finished={state.finished}
            onGoHome={goToSetup}
          />
        )}
        <Outlet />
        {!inActiveQuiz && <Footer />}
      </div>
    </div>
  )
}
