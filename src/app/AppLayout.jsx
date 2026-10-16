import { useEffect, useLayoutEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useStudyroom } from '../features/studyroom/StudyroomContext.js'
import { getCourse } from '../data/courseData.js'

const THEME_STORAGE_KEY = 'nptel-studyroom-theme'

function getPreferredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme
  } catch (error) {
    console.error('Could not read the saved theme preference.', error)
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch, persistenceWarning } = useStudyroom()
  const course = getCourse(state.courseId)
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [theme, setTheme] = useState(getPreferredTheme)
  const { quiz, currentQuestionIndex, selectedAnswers } = state
  const answeredCount = quiz
    ? quiz.questions.filter((question) => selectedAnswers[question.id] !== undefined).length
    : 0
  const progress = quiz ? (answeredCount / quiz.questions.length) * 100 : 0
  const inActiveQuiz = Boolean(quiz && !state.finished && location.pathname.includes('/quiz/'))
  const isCourseHome = location.pathname === '/'
  const hasSidebar = Boolean(!inActiveQuiz && course && !isCourseHome)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#101923' : '#edf2f6')
  }, [theme])

  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const updateFromSystem = (event) => {
      try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
        if (storedTheme === 'dark' || storedTheme === 'light') return
      } catch (error) {
        console.error('Could not check the saved theme preference.', error)
      }
      setTheme(event.matches ? 'dark' : 'light')
    }
    colorScheme.addEventListener('change', updateFromSystem)
    return () => colorScheme.removeEventListener('change', updateFromSystem)
  }, [])

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      } catch (error) {
        console.error('Could not save the theme preference.', error)
      }
      return nextTheme
    })
  }

  function goToSetup() {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-(--c-101923) font-sans text-(--c-d6e1e9)">
      {hasSidebar && (
        <Sidebar
          course={course}
          onToggleWeek={(week) => dispatch({ type: 'toggle-week', week })}
          quiz={quiz}
          answeredCount={answeredCount}
          progress={progress}
          currentQuestionIndex={currentQuestionIndex}
          finished={state.finished}
        />
      )}
      <div className={`min-h-screen ${hasSidebar ? 'md:ml-62.5' : ''}`}>
        {persistenceWarning && (
          <p role="status" className="bg-(--c-3b3020) px-5 py-3 text-center text-xs font-semibold text-(--c-f0d39c)">
            {persistenceWarning}
          </p>
        )}
        {!isOnline && (
          <p role="status" className="bg-(--c-3b3020) px-5 py-3 text-center text-xs font-semibold text-(--c-f0d39c)">
            You are offline. Your saved test can continue on this device.
          </p>
        )}
        {!inActiveQuiz && (
          <Navbar
            courseId={state.courseId}
            quiz={quiz}
            questionIndex={currentQuestionIndex}
            finished={state.finished}
            onGoHome={goToSetup}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
        <Outlet context={{ theme, onToggleTheme: toggleTheme }} />
        {!inActiveQuiz && <Footer />}
      </div>
    </div>
  )
}
