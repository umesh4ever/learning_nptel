import Icon from '../../components/Icon.jsx'
import { getCoursePath } from '../../data/courseData.js'

export default function LearningQuizEnd({ quiz, selectedAnswers, dispatch, navigate, courseId }) {
  const weekNumbers = quiz.weeks.map((week) => week.week)
  const correctCount = quiz.questions.filter(
    (question) => selectedAnswers[question.id] === question.correct_answer,
  ).length
  const total = quiz.questions.length

  const resetAndHome = () => {
    dispatch({ type: 'return-to-setup' })
    navigate('/')
  }

  const resetAndCreate = () => {
    dispatch({ type: 'return-to-setup' })
    navigate(getCoursePath(courseId))
  }

  return (
    <main className="mx-auto w-full max-w-295 px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <section className="mb-8 max-w-3xl text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-(--c-1e3445) text-(--c-a9f3d4)">
          <Icon name="check" className="size-5" />
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--c-dce7ef) sm:text-4xl">
          Learning quiz complete
        </h1>
        <p className="mt-2.5 text-sm leading-6 text-(--c-a2b2bf)">
          You have answered all {total} question{total !== 1 ? 's' : ''}.
        </p>
      </section>

      <section className="mx-auto w-full max-w-xl rounded-2xl border border-(--c-2b3b49) bg-(--c-182633) p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-(--c-91a4b3)">Quiz covered</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-(--c-dce7ef)">
          {weekNumbers.length === 1 ? `Week ${weekNumbers[0]}` : `Weeks ${weekNumbers.join(', ')}`}
        </h2>
        <p className="mt-2 text-xs leading-5 text-(--c-a2b2bf)">
          {quiz.isAssignment ? 'Assignment questions' : 'Practice questions'}
          {quiz.difficulty && !quiz.isAssignment && ` · ${quiz.difficulty} difficulty`}
        </p>

        <div className="mt-6 rounded-xl border border-(--c-354958) bg-(--c-14212c) p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-(--c-a7c6dc)">Correct answers</span>
            <span className="text-base font-bold text-(--c-a9f3d4)">
              {correctCount} / {total}
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-(--c-9aabba)">
            Answers were shown after each option. No score is recorded for learning quizzes.
          </p>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-(--c-2d3e4b) pt-4 sm:flex-row sm:border-0 sm:pt-1">
          <button
            type="button"
            onClick={resetAndCreate}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--c-394c5b) bg-(--c-202f3c) px-4 text-sm font-bold text-(--c-bdcbd5) transition-transform hover:bg-(--c-293d4d) active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) sm:order-1 sm:min-h-10 sm:w-auto"
          >
            <Icon name="reset" className="size-4" />
            Create another quiz
          </button>
          <button
            type="button"
            onClick={resetAndHome}
            className="flex min-h-12 min-w-0 w-full items-center justify-center gap-2 rounded-xl bg-(--c-2d6485) px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.24)] transition-transform hover:bg-(--c-39799d) hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] active:scale-[0.98] sm:order-2 sm:min-h-10 sm:w-auto sm:flex-1"
          >
            Back to home
            <Icon name="arrow" className="size-4.5" />
          </button>
        </div>
      </section>
    </main>
  )
}