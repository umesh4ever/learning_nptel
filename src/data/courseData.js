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

export function createTestQuestions(selectedWeeks, difficulty, totalCount) {
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
