// Normalized Course Catalog & Dynamic Question Loaders

export const difficultyOptions = ['Easy', 'Medium/Hard', 'Mixed']
export const durationOptions = [5, 10, 15, 30, 45, 60, 120, 180]

// Lightweight course metadata available immediately for homepage & navigation
export const coursesCatalog = {
  'conservation-geography': {
    id: 'conservation-geography',
    name: 'Conservation Geography',
    shortName: 'Conservation Geography',
    description: 'Practice weekly Conservation Geography assignment questions.',
    isAssignment: true,
    hasNotes: false,
    category: 'assignments',
    weekCount: 12,
    questionCount: 120,
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      topic_title: `Week ${i + 1} Assignment`,
      questions: [],
    })),
  },
  'iiot-4.0-assignments': {
    id: 'iiot-4.0-assignments',
    name: 'Industry 4.0 & Industrial IoT (Assignments)',
    shortName: 'IIoT 4.0 Assignments',
    description: 'Practice weekly NPTEL assignment questions for Industry 4.0 & IIoT.',
    isAssignment: true,
    hasNotes: false,
    category: 'assignments',
    weekCount: 10,
    questionCount: 150,
    weeks: Array.from({ length: 10 }, (_, i) => ({
      week: i + 1,
      topic_title: `Week ${i + 1} Assignment`,
      questions: [],
    })),
  },
  'iiot-4.0': {
    id: 'iiot-4.0',
    name: 'Industry 4.0 & Industrial IoT',
    shortName: 'IIoT 4.0',
    description: 'Practice connected industry, industrial IoT, and Industry 4.0 concepts.',
    isAssignment: false,
    hasNotes: true,
    category: 'practice',
    weekCount: 12,
    questionCount: 360,
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      topic_title: `Week ${i + 1}`,
      questions: [],
    })),
  },
  iiot: {
    id: 'iiot',
    name: 'Introduction to the Internet of Things',
    shortName: 'Intro to IoT',
    description: 'Practice IoT architecture, networking, sensors, analytics, and applications.',
    isAssignment: false,
    hasNotes: true,
    category: 'practice',
    weekCount: 12,
    questionCount: 360,
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      topic_title: `Week ${i + 1}`,
      questions: [],
    })),
  },
}

export const courses = coursesCatalog
export const courseList = Object.values(coursesCatalog)

// In-memory cache for loaded full course data (with questions)
const courseCache = new Map()

// Dynamic per-course JSON loaders for code-splitting
const courseLoaders = {
  'conservation-geography': () =>
    import.meta.glob('./assignments/CG/week_*_assignment.json', { import: 'default' }),
  'iiot-4.0-assignments': () =>
    import.meta.glob('./assignments/iiot-4.0/industry_4_0_week_*_assignment.json', { import: 'default' }),
  'iiot-4.0': () =>
    import.meta.glob('./notes_based/iiot-4.0/week*_questions.json', { import: 'default' }),
  iiot: () =>
    import.meta.glob('./notes_based/iiot/week*_questions.json', { import: 'default' }),
}

/**
 * Normalizes question options to uppercase keys (A, B, C, D)
 * and ensures standard fields across assignment and notes-based formats.
 */
export function normalizeQuestion(raw, { weekNumber, weekTitle, topicName, idPrefix = 'Q' }) {
  const rawOptions = raw.options ?? {}
  const options = {}
  for (const [key, val] of Object.entries(rawOptions)) {
    options[key.toUpperCase()] = val
  }

  const rawAnswer = String(raw.correct_option ?? raw.correct_answer ?? '').trim()
  let correct_answer = rawAnswer.toUpperCase()
  if (options[correct_answer] === undefined) {
    const matched = Object.entries(options).find(
      ([, v]) => String(v).trim().toLowerCase() === rawAnswer.toLowerCase(),
    )
    if (matched) correct_answer = matched[0]
  }

  const justification =
    raw.justification ??
    raw.explanation ??
    (raw.correct_answer && options[correct_answer] ? `Correct answer: ${options[correct_answer]}` : '')

  return {
    id: raw.id ?? `${idPrefix}_W${weekNumber}_Q${raw.question_number}`,
    difficulty: raw.difficulty ?? 'Easy',
    question: raw.question,
    options,
    correct_answer,
    justification,
    topic_name: topicName || `Week ${weekNumber}`,
    week_number: Number(weekNumber),
    week_title: weekTitle || `Week ${weekNumber}`,
  }
}

function processAssignmentWeeks(rawFiles, idPrefix = 'CG') {
  return Object.values(rawFiles)
    .sort((a, b) => a.week - b.week)
    .map((assignment) => {
      const weekTitle = `Week ${assignment.week} Assignment`
      const topicName = assignment.assignment_title || weekTitle
      const questions = (assignment.questions ?? []).map((q) =>
        normalizeQuestion(q, {
          weekNumber: assignment.week,
          weekTitle,
          topicName,
          idPrefix,
        }),
      )
      const topic = {
        topic_id: `${idPrefix}_W${assignment.week}`,
        topic_name: topicName,
        description: '',
        questions,
      }
      return {
        ...assignment,
        topic_title: weekTitle,
        topics: [topic],
        questions,
      }
    })
}

function processNotesWeeks(rawFiles, courseId) {
  return Object.values(rawFiles)
    .sort((a, b) => a.week - b.week)
    .map((week) => {
      const weekTitle = week.topic_title || week.topics?.[0]?.topic_name || `Week ${week.week}`
      const topics = (week.topics ?? []).map((t) => ({
        ...t,
        questions: (t.questions ?? []).map((q) =>
          normalizeQuestion(q, {
            weekNumber: week.week,
            weekTitle,
            topicName: t.topic_name,
            idPrefix: courseId === 'iiot-4.0' ? 'IIOT4' : 'IIOT',
          }),
        ),
      }))
      const questions = topics.flatMap((t) => t.questions)
      return {
        ...week,
        topic_title: weekTitle,
        topics,
        questions,
      }
    })
}

/**
 * Asynchronously loads and normalizes question data for a course.
 * Cached in memory after first load.
 */
export async function loadCourse(courseId) {
  if (courseCache.has(courseId)) {
    return courseCache.get(courseId)
  }

  const meta = coursesCatalog[courseId]
  if (!meta) return null

  const loader = courseLoaders[courseId]
  if (!loader) return meta

  const fileLoaders = loader()
  const rawModules = await Promise.all(
    Object.values(fileLoaders).map((importFn) => importFn()),
  )

  let weeks = []
  if (courseId === 'conservation-geography') {
    weeks = processAssignmentWeeks(rawModules, 'CG')
  } else if (courseId === 'iiot-4.0-assignments') {
    weeks = processAssignmentWeeks(rawModules, 'IIOT4_ASSIGN')
  } else {
    weeks = processNotesWeeks(rawModules, courseId)
  }

  const loadedCourse = {
    ...meta,
    weeks,
    questionCount: weeks.reduce((total, w) => total + w.questions.length, 0),
  }

  courseCache.set(courseId, loadedCourse)
  return loadedCourse
}

export function getCourse(courseId) {
  return courseCache.get(courseId) ?? coursesCatalog[courseId] ?? null
}

export function getCoursePath(courseId, route = 'setup/weeks') {
  return `/courses/${courseId}/${route}`
}

export function getWeekNotes(week) {
  if (!week?.topics) return []
  return week.topics.map((topic) => ({
    title: topic.topic_name,
    description: topic.topic_description ?? topic.description ?? '',
    notes: (topic.questions ?? [])
      .map((q) => ({
        text: q.justification ?? q.explanation ?? '',
        keyTerm: q.options?.[q.correct_answer] ?? '',
      }))
      .filter((n) => n.text.trim().length > 0),
  }))
}

export function getAvailableQuestions(week, difficulty) {
  if (!week?.questions) return 0
  if (difficulty === 'Mixed') return week.questions.length
  return week.questions.filter((q) => q.difficulty === difficulty).length
}

export function getMaxTestQuestionCount(selectedWeeks, difficulty) {
  if (!selectedWeeks || selectedWeeks.length === 0) return 0
  const minimumPerWeek = Math.min(
    ...selectedWeeks.map((week) => getAvailableQuestions(week, difficulty)),
  )
  return minimumPerWeek * selectedWeeks.length
}

export function normalizeTotalQuestionCount(count, selectedWeeks, difficulty) {
  const weekCount = selectedWeeks?.length ?? 0
  const maxCount = getMaxTestQuestionCount(selectedWeeks, difficulty)
  if (weekCount === 0 || maxCount === 0) return 0

  const numeric = Number(count)
  const desired = Number.isInteger(numeric) && numeric > 0 ? numeric : weekCount
  const bounded = Math.min(desired, maxCount)
  const divisible = Math.floor(bounded / weekCount) * weekCount
  return Math.max(weekCount, divisible)
}

function shuffleQuestions(questions) {
  const shuffled = [...questions]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swap = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[swap]
    shuffled[swap] = temp
  }
  return shuffled
}

function createCourseOrderedQuestions(selectedWeeks, difficulty, totalCount) {
  const questionsPerWeek = totalCount / selectedWeeks.length
  return selectedWeeks.flatMap((week, weekIndex) => {
    if (difficulty !== 'Mixed') {
      return week.questions
        .filter((q) => q.difficulty === difficulty)
        .slice(0, questionsPerWeek)
    }

    const easy = week.questions.filter((q) => q.difficulty === 'Easy')
    const harder = week.questions.filter((q) => q.difficulty === 'Medium/Hard')
    const mixed = []
    let easyIdx = 0
    let hardIdx = 0
    for (let i = 0; i < questionsPerWeek; i += 1) {
      const preferEasy = (i + weekIndex) % 2 === 0
      const q = preferEasy ? easy[easyIdx] ?? harder[hardIdx] : harder[hardIdx] ?? easy[easyIdx]
      if (!q) break
      mixed.push(q)
      if (q.difficulty === 'Easy') easyIdx += 1
      else hardIdx += 1
    }
    return mixed
  })
}

export function createTestQuestions(selectedWeeks, difficulty, totalCount, { randomize = true } = {}) {
  const allQuestions = selectedWeeks.flatMap((week) => week.questions)
  if (totalCount === allQuestions.length) {
    return randomize ? shuffleQuestions(allQuestions) : allQuestions
  }
  if (!randomize) return createCourseOrderedQuestions(selectedWeeks, difficulty, totalCount)
  if (selectedWeeks.length === 0 || !Number.isInteger(totalCount) || totalCount <= 0) return []

  const questionsPerWeek = totalCount / selectedWeeks.length
  if (!Number.isInteger(questionsPerWeek)) {
    const eligible = difficulty === 'Mixed'
      ? allQuestions
      : allQuestions.filter((q) => q.difficulty === difficulty)
    return (randomize ? shuffleQuestions(eligible) : eligible).slice(0, totalCount)
  }

  const selectedQuestions = selectedWeeks.flatMap((week, weekIndex) => {
    if (difficulty !== 'Mixed') {
      const eligible = week.questions.filter((q) => q.difficulty === difficulty)
      return shuffleQuestions(eligible).slice(0, questionsPerWeek)
    }

    const easy = shuffleQuestions(week.questions.filter((q) => q.difficulty === 'Easy'))
    const harder = shuffleQuestions(week.questions.filter((q) => q.difficulty === 'Medium/Hard'))
    const easyTarget = Math.floor(questionsPerWeek / 2) + (questionsPerWeek % 2 === 1 && weekIndex % 2 === 0 ? 1 : 0)
    const selEasy = easy.slice(0, Math.max(0, easyTarget))
    const selHarder = harder.slice(0, questionsPerWeek - selEasy.length)
    const selIds = new Set([...selEasy, ...selHarder].map((q) => q.id))
    const remaining = shuffleQuestions([...easy, ...harder].filter((q) => !selIds.has(q.id)))
    return [...selEasy, ...selHarder, ...remaining].slice(0, questionsPerWeek)
  })

  return shuffleQuestions(selectedQuestions)
}
