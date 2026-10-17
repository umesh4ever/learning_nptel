import { useCallback, useLayoutEffect, useMemo, useReducer, useState } from 'react'
import {
  createTestQuestions,
  courseList,
  durationOptions,
  getAvailableQuestions,
  getCourse,
  normalizeTotalQuestionCount,
} from '../../data/courseData.js'
import { StudyroomContext } from './StudyroomContext.js'

const STORAGE_KEY_PREFIX = 'nptel-studyroom-state-v2:'
const LEGACY_STORAGE_KEY = 'nptel-studyroom-state-v1'
const ACTIVE_COURSE_STORAGE_KEY = 'nptel-studyroom-active-course'
const STORAGE_KEY = (courseId) => `${STORAGE_KEY_PREFIX}${courseId}`

function isRestorableQuizQuestion(question, quizWeeks, difficulty) {
  const isInSelectedWeeks = quizWeeks.some((week) => week.week === question.week_number)
  const matchesDifficulty =
    difficulty === 'Mixed'
      ? ['Easy', 'Medium/Hard'].includes(question.difficulty)
      : question.difficulty === difficulty

  return isInSelectedWeeks && matchesDifficulty
}

function createInitialState(courseId = null) {
  const course = getCourse(courseId)
  const selectedWeeks = course?.weeks[0] ? [course.weeks[0]] : []
  const isAssignment = Boolean(course?.isAssignment)
  const totalAssignmentAvailable = selectedWeeks[0] ? selectedWeeks[0].questions.length : 0
  const defaultCount = isAssignment
    ? Math.min(10, totalAssignmentAvailable || 10)
    : Math.min(10, selectedWeeks[0] ? getAvailableQuestions(selectedWeeks[0], 'Easy') : 0)

  return {
    courseId,
    selectedWeeks,
    difficulty: 'Easy',
    questionCount: defaultCount,
    durationMinutes: 30,
    quiz: null,
    currentQuestionIndex: 0,
    selectedAnswers: {},
    finished: false,
  }
}

function restoreState(courseId) {
  const initialState = createInitialState(courseId)
  const course = getCourse(courseId)
  if (!course) return { state: createInitialState(), warning: '' }

  try {
    const savedValue =
      window.localStorage.getItem(STORAGE_KEY(courseId)) ??
      (courseId === 'iiot-4.0' ? window.localStorage.getItem(LEGACY_STORAGE_KEY) : null)
    if (!savedValue) return { state: initialState, warning: '' }

    const savedState = JSON.parse(savedValue)
    const selectedWeekNumbers = Array.isArray(savedState.selectedWeekNumbers)
      ? savedState.selectedWeekNumbers
      : [course.weeks[0]?.week]
    const selectedWeeks = course.weeks.filter((week) => selectedWeekNumbers.includes(week.week))
    const restoredWeeks = Array.isArray(savedState.selectedWeekNumbers)
      ? selectedWeeks
      : initialState.selectedWeeks
    const difficulty = ['Medium/Hard', 'Mixed'].includes(savedState.difficulty)
      ? savedState.difficulty
      : 'Easy'
    const isAssignment = Boolean(course.isAssignment)
    const totalAssignmentQuestions = isAssignment
      ? restoredWeeks.reduce((total, week) => total + week.questions.length, 0)
      : 0
    const rawCount = Number(savedState.questionCount)
    const questionCount = isAssignment
      ? (rawCount && rawCount <= totalAssignmentQuestions ? rawCount : Math.min(10, totalAssignmentQuestions))
      : normalizeTotalQuestionCount(
          savedState.questionCount,
          restoredWeeks,
          difficulty,
        )
    const durationValue = Number(savedState.durationMinutes)
    const durationMinutes = durationOptions.includes(durationValue) ? durationValue : 30

    let quiz = null
    let quizRestoreWarning = ''
    if (savedState.quiz && Array.isArray(savedState.quiz.weekNumbers)) {
      const quizWeeks = course.weeks.filter((week) => savedState.quiz.weekNumbers.includes(week.week))
      const quizDifficulty = ['Medium/Hard', 'Mixed'].includes(savedState.quiz.difficulty)
        ? savedState.quiz.difficulty
        : 'Easy'
      const quizQuestionCount = Number(savedState.quiz.questionCount)
      const endsAt = Number(savedState.quiz.endsAt)
      const quizDurationMinutes = Number(savedState.quiz.durationMinutes ?? savedState.durationMinutes)
      const savedStartedAt = Number(savedState.quiz.startedAt)
      const startedAt = Number.isFinite(savedStartedAt)
        ? savedStartedAt
        : endsAt - quizDurationMinutes * 60 * 1000
      const savedCompletedAt = Number(savedState.quiz.completedAt)
      const completedAt = savedState.finished
        ? Math.min(
            Number.isFinite(savedCompletedAt) ? savedCompletedAt : Date.now(),
            endsAt,
          )
        : null
      const hasSavedQuestionIds = Array.isArray(savedState.quiz.questionIds)
      const isLegacyQuiz = savedState.quiz.questionIds === undefined
      const questionsById = new Map(
        course.weeks.flatMap((week) => week.questions.map((question) => [question.id, question])),
      )
      const questions = hasSavedQuestionIds
        ? savedState.quiz.questionIds.map((questionId) => questionsById.get(questionId))
        : isLegacyQuiz && quizWeeks.length > 0
          ? createTestQuestions(quizWeeks, quizDifficulty, quizQuestionCount, { randomize: false })
          : []
      const questionsPerWeek = quizWeeks.length > 0 ? quizQuestionCount / quizWeeks.length : 0
      const isAssignmentCourse = Boolean(course.isAssignment)
      const hasValidQuestionSet =
        Number.isInteger(quizQuestionCount) &&
        quizQuestionCount > 0 &&
        (isAssignmentCourse || Number.isInteger(questionsPerWeek)) &&
        questions.length === quizQuestionCount &&
        questions.every(
          (question) =>
            question !== undefined &&
            isRestorableQuizQuestion(question, quizWeeks, quizDifficulty),
        ) &&
        new Set(questions.map((question) => question.id)).size === questions.length &&
        (isAssignmentCourse ||
          quizWeeks.every(
            (week) => questions.filter((question) => question.week_number === week.week).length === questionsPerWeek,
          ))
      if (
        quizWeeks.length > 0 &&
        quizWeeks.length === savedState.quiz.weekNumbers.length &&
        hasValidQuestionSet &&
        Number.isFinite(endsAt) &&
        Number.isFinite(startedAt) &&
        durationOptions.includes(quizDurationMinutes) &&
        startedAt < endsAt &&
        (completedAt === null || (completedAt >= startedAt && completedAt <= endsAt))
      ) {
        quiz = {
          weeks: quizWeeks,
          difficulty: quizDifficulty,
          isAssignment: course.isAssignment,
          questions,
          startedAt,
          endsAt,
          completedAt,
        }
      } else if (!isLegacyQuiz) {
        console.error('The saved quiz question selection is invalid and could not be restored.')
        quizRestoreWarning = 'The saved quiz could not be restored because its question selection is invalid. Your setup is ready.'
      }
    }

    const selectedAnswers = quiz
      ? Object.fromEntries(
          Object.entries(savedState.selectedAnswers ?? {}).filter(([questionId, answer]) =>
            quiz.questions.some(
              (question) =>
                question.id === questionId && Object.hasOwn(question.options, answer),
            ),
          ),
        )
      : {}
    const questionIndex = Number(savedState.currentQuestionIndex)
    const currentQuestionIndex =
      quiz && Number.isInteger(questionIndex) && questionIndex >= 0 && questionIndex < quiz.questions.length
        ? questionIndex
        : 0

    return {
      state: {
        ...initialState,
        courseId,
        selectedWeeks: restoredWeeks,
        difficulty,
        questionCount,
        durationMinutes,
        quiz,
        currentQuestionIndex,
        selectedAnswers,
        finished: Boolean(savedState.finished && quiz),
      },
      warning: quizRestoreWarning,
    }
  } catch (error) {
    console.error('Could not restore saved studyroom state.', error)
    return {
      state: initialState,
      warning: 'The saved study could not be read. A fresh setup is ready.',
    }
  }
}

function restoreActiveCourseState() {
  try {
    const courseId = window.localStorage.getItem(ACTIVE_COURSE_STORAGE_KEY)
    if (courseId && getCourse(courseId)) return restoreState(courseId)
  } catch (error) {
    console.error('Could not read the active course preference.', error)
    return {
      state: createInitialState(),
      warning: 'The last course could not be restored. Choose a course to continue.',
    }
  }

  return { state: createInitialState(), warning: '' }
}

function serializeState(state) {
  return JSON.stringify({
    selectedWeekNumbers: state.selectedWeeks.map((week) => week.week),
    difficulty: state.difficulty,
    questionCount: state.questionCount,
    durationMinutes: state.durationMinutes,
    quiz: state.quiz
      ? {
          weekNumbers: state.quiz.weeks.map((week) => week.week),
          difficulty: state.quiz.difficulty,
          questionCount: state.quiz.questions.length,
          questionIds: state.quiz.questions.map((question) => question.id),
          durationMinutes: (state.quiz.endsAt - state.quiz.startedAt) / 60000,
          startedAt: state.quiz.startedAt,
          completedAt: state.quiz.completedAt,
          endsAt: state.quiz.endsAt,
        }
      : null,
    currentQuestionIndex: state.currentQuestionIndex,
    selectedAnswers: state.selectedAnswers,
    finished: state.finished,
  })
}

function studyroomReducer(state, action) {
  switch (action.type) {
    case 'select-course':
      return action.state
    case 'toggle-week': {
      const course = getCourse(state.courseId)
      const courseWeeks = course?.weeks ?? []
      const selected = state.selectedWeeks.some((week) => week.week === action.week.week)
      const selectedWeeks = selected
        ? state.selectedWeeks.filter((week) => week.week !== action.week.week)
        : courseWeeks.filter((week) =>
            state.selectedWeeks.some((selectedWeek) => selectedWeek.week === week.week) ||
            week.week === action.week.week,
          )
      const isAssignment = Boolean(course?.isAssignment)
      const totalAssignmentQuestions = isAssignment
        ? selectedWeeks.reduce((total, week) => total + week.questions.length, 0)
        : 0
      const questionCount = isAssignment
        ? (state.questionCount && state.questionCount <= totalAssignmentQuestions ? state.questionCount : Math.min(10, totalAssignmentQuestions))
        : normalizeTotalQuestionCount(
            state.questionCount,
            selectedWeeks,
            state.difficulty,
          )
      return {
        ...state,
        selectedWeeks,
        questionCount,
      }
    }
    case 'reset-weeks': {
      const courseWeeks = getCourse(state.courseId)?.weeks ?? []
      const selectedWeeks = courseWeeks.length > 0 ? [courseWeeks[0]] : []
      return {
        ...state,
        selectedWeeks,
        questionCount: normalizeTotalQuestionCount(state.questionCount, selectedWeeks, state.difficulty),
      }
    }
    case 'complete-paper': {
      const courseWeeks = getCourse(state.courseId)?.weeks ?? []
      return {
        ...state,
        selectedWeeks: courseWeeks,
        difficulty: 'Mixed',
        questionCount: getCourse(state.courseId)?.isAssignment
          ? courseWeeks.reduce((total, week) => total + week.questions.length, 0)
          : courseWeeks.length,
      }
    }
    case 'set-difficulty':
      return {
        ...state,
        difficulty: action.difficulty,
        questionCount: normalizeTotalQuestionCount(
          state.questionCount,
          state.selectedWeeks,
          action.difficulty,
        ),
      }
    case 'set-question-count':
      return { ...state, questionCount: action.count }
    case 'set-duration':
      return durationOptions.includes(Number(action.minutes))
        ? { ...state, durationMinutes: Number(action.minutes) }
        : state
    case 'reset-paper': {
      const course = getCourse(state.courseId)
      const courseWeeks = course?.weeks ?? []
      const isCompletePaper =
        state.selectedWeeks.length === courseWeeks.length &&
        courseWeeks.every((week) => state.selectedWeeks.some((selected) => selected.week === week.week))
      const difficulty = isCompletePaper ? 'Mixed' : 'Easy'
      const defaultQuestionsPerWeek = isCompletePaper ? 1 : 10
      const totalAssignmentQuestions = course?.isAssignment
        ? state.selectedWeeks.reduce((total, week) => total + week.questions.length, 0)
        : 0
      return {
        ...state,
        difficulty,
        questionCount: course?.isAssignment
          ? Math.min(10, totalAssignmentQuestions)
          : normalizeTotalQuestionCount(
              state.selectedWeeks.length * defaultQuestionsPerWeek,
              state.selectedWeeks,
              difficulty,
            ),
        durationMinutes: 30,
      }
    }
    case 'start-quiz': {
      const difficulty = action.difficulty ?? state.difficulty
      if (!durationOptions.includes(action.durationMinutes)) return state
      const questions = createTestQuestions(
        state.selectedWeeks,
        difficulty,
        action.questionCount,
      )
      if (questions.length !== action.questionCount) return state
      const startedAt = Date.now()
      return {
        ...state,
        quiz: {
          weeks: state.selectedWeeks,
          difficulty,
          isAssignment: Boolean(getCourse(state.courseId)?.isAssignment),
          questions,
          startedAt,
          endsAt: startedAt + action.durationMinutes * 60 * 1000,
          completedAt: null,
        },
        currentQuestionIndex: 0,
        selectedAnswers: {},
        finished: false,
      }
    }
    case 'save-answer': {
      if (!state.quiz || Date.now() >= state.quiz.endsAt || state.finished) return state
      const question = state.quiz.questions[action.questionIndex]
      if (!question || question.id !== action.questionId) return state
      return {
        ...state,
        selectedAnswers: { ...state.selectedAnswers, [action.questionId]: action.answer },
        currentQuestionIndex: Math.min(action.questionIndex + 1, state.quiz.questions.length - 1),
      }
    }
    case 'set-current-question':
      if (!state.quiz || action.index < 0 || action.index >= state.quiz.questions.length) return state
      return { ...state, currentQuestionIndex: action.index }
    case 'submit-quiz': {
      if (!state.quiz || state.finished) return state
      return {
        ...state,
        quiz: { ...state.quiz, completedAt: Math.min(Date.now(), state.quiz.endsAt) },
        finished: true,
      }
    }
    case 'return-to-setup':
      return {
        ...state,
        quiz: null,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        finished: false,
      }
    default:
      return state
  }
}

export function StudyroomProvider({ children }) {
  const [initial] = useState(restoreActiveCourseState)
  const [state, dispatch] = useReducer(studyroomReducer, initial.state)
  const [persistenceWarning, setPersistenceWarning] = useState(initial.warning)

  useLayoutEffect(() => {
    if (!state.courseId) return undefined
    let warningTimer
    try {
      window.localStorage.setItem(STORAGE_KEY(state.courseId), serializeState(state))
      if (persistenceWarning) {
        warningTimer = window.setTimeout(() => setPersistenceWarning(''), 5000)
      }
    } catch (error) {
      console.error('Could not save studyroom state locally.', error)
      warningTimer = window.setTimeout(
        () => setPersistenceWarning('Progress cannot be saved on this device right now.'),
        0,
      )
    }
    return () => window.clearTimeout(warningTimer)
  }, [persistenceWarning, state])

  const selectCourse = useCallback((courseId) => {
    if (!getCourse(courseId)) return null

    let saveWarning = ''
    try {
      if (state.courseId) {
        window.localStorage.setItem(STORAGE_KEY(state.courseId), serializeState(state))
      }
      window.localStorage.setItem(ACTIVE_COURSE_STORAGE_KEY, courseId)
    } catch (error) {
      console.error('Could not save the current course state locally.', error)
      saveWarning = 'The current course progress could not be saved on this device.'
    }

    const restored = restoreState(courseId)
    dispatch({ type: 'select-course', state: restored.state })
    setPersistenceWarning(restored.warning || saveWarning)
    return restored.state
  }, [state])

  const contextValue = useMemo(
    () => ({ state, dispatch, persistenceWarning, selectCourse, courses: courseList }),
    [state, persistenceWarning, selectCourse],
  )

  return <StudyroomContext.Provider value={contextValue}>{children}</StudyroomContext.Provider>
}
