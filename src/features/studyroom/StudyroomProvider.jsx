import { useLayoutEffect, useMemo, useReducer, useState } from 'react'
import {
  createTestQuestions,
  getAvailableQuestions,
  normalizeTotalQuestionCount,
  weeks,
} from '../../data/courseData.js'
import { StudyroomContext } from './StudyroomContext.js'

const STORAGE_KEY = 'nptel-studyroom-state-v1'

function createInitialState() {
  const selectedWeeks = weeks.length > 0 ? [weeks[0]] : []
  return {
    selectedWeeks,
    difficulty: 'Easy',
    questionCount: Math.min(10, selectedWeeks[0] ? getAvailableQuestions(selectedWeeks[0], 'Easy') : 0),
    durationMinutes: 30,
    quiz: null,
    currentQuestionIndex: 0,
    selectedAnswers: {},
    finished: false,
  }
}

function restoreState() {
  const initialState = createInitialState()
  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!savedValue) return { state: initialState, warning: '' }

    const savedState = JSON.parse(savedValue)
    const selectedWeekNumbers = Array.isArray(savedState.selectedWeekNumbers)
      ? savedState.selectedWeekNumbers
      : [weeks[0]?.week]
    const selectedWeeks = weeks.filter((week) => selectedWeekNumbers.includes(week.week))
    const restoredWeeks = selectedWeeks.length > 0 ? selectedWeeks : initialState.selectedWeeks
    const difficulty = ['Medium/Hard', 'Mixed'].includes(savedState.difficulty)
      ? savedState.difficulty
      : 'Easy'
    const questionCount = normalizeTotalQuestionCount(
      savedState.questionCount,
      restoredWeeks,
      difficulty,
    )
    const durationValue = Number(savedState.durationMinutes)
    const durationMinutes =
      Number.isInteger(durationValue) && durationValue >= 5 && durationValue % 5 === 0
        ? durationValue
        : 30

    let quiz = null
    if (savedState.quiz && Array.isArray(savedState.quiz.weekNumbers)) {
      const quizWeeks = weeks.filter((week) => savedState.quiz.weekNumbers.includes(week.week))
      const quizDifficulty = ['Medium/Hard', 'Mixed'].includes(savedState.quiz.difficulty)
        ? savedState.quiz.difficulty
        : 'Easy'
      const quizQuestionCount = Number(savedState.quiz.questionCount)
      const endsAt = Number(savedState.quiz.endsAt)
      const questions = quizWeeks.length > 0
        ? createTestQuestions(quizWeeks, quizDifficulty, quizQuestionCount)
        : []
      if (
        quizWeeks.length > 0 &&
        quizWeeks.length === savedState.quiz.weekNumbers.length &&
        Number.isInteger(quizQuestionCount) &&
        questions.length === quizQuestionCount &&
        Number.isFinite(endsAt)
      ) {
        quiz = { weeks: quizWeeks, difficulty: quizDifficulty, questions, endsAt }
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
        selectedWeeks: restoredWeeks,
        difficulty,
        questionCount,
        durationMinutes,
        quiz,
        currentQuestionIndex,
        selectedAnswers,
        finished: Boolean(savedState.finished && quiz),
      },
      warning: '',
    }
  } catch (error) {
    console.error('Could not restore saved studyroom state.', error)
    return {
      state: initialState,
      warning: 'The saved study could not be read. A fresh setup is ready.',
    }
  }
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
    case 'toggle-week': {
      const selected = state.selectedWeeks.some((week) => week.week === action.week.week)
      if (selected && state.selectedWeeks.length === 1) return state
      const selectedWeeks = selected
        ? state.selectedWeeks.filter((week) => week.week !== action.week.week)
        : weeks.filter((week) =>
            state.selectedWeeks.some((selectedWeek) => selectedWeek.week === week.week) ||
            week.week === action.week.week,
          )
      return {
        ...state,
        selectedWeeks,
        questionCount: normalizeTotalQuestionCount(
          state.questionCount,
          selectedWeeks,
          state.difficulty,
        ),
      }
    }
    case 'reset-weeks': {
      const selectedWeeks = weeks.length > 0 ? [weeks[0]] : []
      return {
        ...state,
        selectedWeeks,
        questionCount: normalizeTotalQuestionCount(state.questionCount, selectedWeeks, state.difficulty),
      }
    }
    case 'complete-paper':
      return {
        ...state,
        selectedWeeks: weeks,
        difficulty: 'Mixed',
        questionCount: weeks.length,
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
      return { ...state, durationMinutes: action.minutes }
    case 'reset-paper': {
      const isCompletePaper =
        state.selectedWeeks.length === weeks.length &&
        weeks.every((week) => state.selectedWeeks.some((selected) => selected.week === week.week))
      const difficulty = isCompletePaper ? 'Mixed' : 'Easy'
      const defaultQuestionsPerWeek = isCompletePaper ? 1 : 10
      return {
        ...state,
        difficulty,
        questionCount: normalizeTotalQuestionCount(
          state.selectedWeeks.length * defaultQuestionsPerWeek,
          state.selectedWeeks,
          difficulty,
        ),
        durationMinutes: 30,
      }
    }
    case 'start-quiz': {
      const questions = createTestQuestions(
        state.selectedWeeks,
        state.difficulty,
        action.questionCount,
      )
      if (questions.length !== action.questionCount) return state
      return {
        ...state,
        quiz: {
          weeks: state.selectedWeeks,
          difficulty: state.difficulty,
          questions,
          endsAt: Date.now() + action.durationMinutes * 60 * 1000,
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
      return { ...state, finished: true }
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
  const [restored] = useState(restoreState)
  const [state, dispatch] = useReducer(studyroomReducer, restored.state)
  const [persistenceWarning, setPersistenceWarning] = useState(restored.warning)

  useLayoutEffect(() => {
    let warningTimer
    try {
      window.localStorage.setItem(STORAGE_KEY, serializeState(state))
      if (persistenceWarning) {
        warningTimer = window.setTimeout(() => setPersistenceWarning(''), 0)
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

  const contextValue = useMemo(
    () => ({ state, dispatch, persistenceWarning }),
    [state, persistenceWarning],
  )

  return <StudyroomContext.Provider value={contextValue}>{children}</StudyroomContext.Provider>
}
