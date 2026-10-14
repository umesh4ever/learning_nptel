const questionFiles = import.meta.glob('./week*_questions.json', {
  eager: true,
  import: 'default',
})

export const weeks = Object.values(questionFiles)
  .sort((first, second) => first.week - second.week)
  .map((week) => ({
    ...week,
    topic_title: week.topic_title || week.topics[0]?.topic_name || `Week ${week.week}`,
    questions: week.topics.flatMap((topic) =>
      topic.questions.map((question) => ({
        ...question,
        topic_name: topic.topic_name,
        week_number: week.week,
        week_title: week.topic_title || week.topics[0]?.topic_name || `Week ${week.week}`,
      })),
    ),
  }))

export const difficultyOptions = ['Easy', 'Medium/Hard', 'Mixed']

export function getAvailableQuestions(week, difficulty) {
  if (difficulty === 'Mixed') return week.questions.length
  return week.questions.filter((question) => question.difficulty === difficulty).length
}

export function getMaxTestQuestionCount(selectedWeeks, difficulty) {
  if (selectedWeeks.length === 0) return 0

  const minimumAvailablePerWeek = Math.min(
    ...selectedWeeks.map((week) => getAvailableQuestions(week, difficulty)),
  )

  return minimumAvailablePerWeek * selectedWeeks.length
}

export function normalizeTotalQuestionCount(count, selectedWeeks, difficulty) {
  const weekCount = selectedWeeks.length
  const maxCount = getMaxTestQuestionCount(selectedWeeks, difficulty)
  if (weekCount === 0 || maxCount === 0) return 0

  const numericCount = Number(count)
  const desiredCount = Number.isInteger(numericCount) && numericCount > 0
    ? numericCount
    : weekCount
  const boundedCount = Math.min(desiredCount, maxCount)
  const evenlyDivisibleCount = Math.floor(boundedCount / weekCount) * weekCount

  return Math.max(weekCount, evenlyDivisibleCount)
}

function shuffleQuestions(questions) {
  const shuffled = [...questions]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const question = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = question
  }
  return shuffled
}

function createCourseOrderedQuestions(selectedWeeks, difficulty, totalCount) {
  const questionsPerWeek = totalCount / selectedWeeks.length

  return selectedWeeks.flatMap((week, weekIndex) => {
    if (difficulty !== 'Mixed') {
      return week.questions
        .filter((question) => question.difficulty === difficulty)
        .slice(0, questionsPerWeek)
    }

    const easyQuestions = week.questions.filter((question) => question.difficulty === 'Easy')
    const harderQuestions = week.questions.filter((question) => question.difficulty === 'Medium/Hard')
    const mixedQuestions = []
    let easyIndex = 0
    let harderIndex = 0
    for (let index = 0; index < questionsPerWeek; index += 1) {
      const preferEasy = (index + weekIndex) % 2 === 0
      const question = preferEasy
        ? easyQuestions[easyIndex] ?? harderQuestions[harderIndex]
        : harderQuestions[harderIndex] ?? easyQuestions[easyIndex]
      if (question === undefined) break
      mixedQuestions.push(question)
      if (question.difficulty === 'Easy') easyIndex += 1
      else harderIndex += 1
    }
    return mixedQuestions
  })
}

export function createTestQuestions(selectedWeeks, difficulty, totalCount, { randomize = true } = {}) {
  if (!randomize) return createCourseOrderedQuestions(selectedWeeks, difficulty, totalCount)
  if (selectedWeeks.length === 0 || !Number.isInteger(totalCount) || totalCount <= 0) return []

  const questionsPerWeek = totalCount / selectedWeeks.length
  if (!Number.isInteger(questionsPerWeek)) return []

  const selectedQuestions = selectedWeeks.flatMap((week, weekIndex) => {
    if (difficulty !== 'Mixed') {
      const eligibleQuestions = week.questions.filter((question) => question.difficulty === difficulty)
      return shuffleQuestions(eligibleQuestions).slice(0, questionsPerWeek)
    }

    const easyQuestions = shuffleQuestions(
      week.questions.filter((question) => question.difficulty === 'Easy'),
    )
    const harderQuestions = shuffleQuestions(
      week.questions.filter((question) => question.difficulty === 'Medium/Hard'),
    )
    const easyTarget =
      Math.floor(questionsPerWeek / 2) +
      (questionsPerWeek % 2 === 1 && weekIndex % 2 === 0 ? 1 : 0)
    const selectedEasy = easyQuestions.slice(0, Math.max(0, easyTarget))
    const selectedHarder = harderQuestions.slice(0, questionsPerWeek - selectedEasy.length)
    const selectedIds = new Set([...selectedEasy, ...selectedHarder].map((question) => question.id))
    const remainingQuestions = shuffleQuestions(
      [...easyQuestions, ...harderQuestions].filter((question) => !selectedIds.has(question.id)),
    )

    return [...selectedEasy, ...selectedHarder, ...remainingQuestions].slice(0, questionsPerWeek)
  })

  return shuffleQuestions(selectedQuestions)
}
