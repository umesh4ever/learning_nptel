import { Navigate, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { difficultyOptions, durationOptions, getCourse, getCoursePath, getMaxTestQuestionCount } from '../../data/courseData.js'
import { useStudyroom } from '../studyroom/StudyroomContext.js'

function NumberStepper({ id, label, value, min, max, step, suffix, onChange }) {
  const numericValue = Number(value)
  const canDecrement = Number.isFinite(numericValue) && numericValue > min
  const canIncrement = max === undefined || !Number.isFinite(numericValue) || numericValue < max

  return (
    <div className="flex h-12 w-full items-center rounded-lg border border-(--c-394c5b) bg-(--c-14212c) p-1 focus-within:border-(--c-6089a4) focus-within:ring-2 focus-within:ring-(--c-315a75)/60 sm:h-10">
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={!canDecrement}
        onClick={() => onChange(Math.max(min, (Number.isFinite(numericValue) ? numericValue : min) - step))}
        className="grid size-11 shrink-0 place-items-center rounded-md bg-(--c-203d52) text-base font-bold text-white transition-colors hover:bg-(--c-2b526d) active:scale-90 disabled:cursor-not-allowed disabled:opacity-70 sm:size-8"
      >
        −
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
        aria-label={label}
        className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent px-1 text-center text-sm font-semibold tabular-nums text-(--c-d6e1e9) outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:text-xs"
      />
      {suffix && <span className="hidden shrink-0 pr-2 text-xs text-(--c-9aabba) sm:block">{suffix}</span>}
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={!canIncrement}
        onClick={() => onChange((Number.isFinite(numericValue) ? numericValue : min) + step)}
        className="grid size-11 shrink-0 place-items-center rounded-md bg-(--c-2d6485) text-base font-bold text-white transition-colors hover:bg-(--c-39799d) active:scale-90 disabled:cursor-not-allowed disabled:opacity-70 sm:size-8"
      >
        +
      </button>
    </div>
  )
}

export default function PaperSetupPage() {
  const { state, dispatch } = useStudyroom()
  const navigate = useNavigate()
  const course = getCourse(state.courseId)

  if (!course) return <Navigate to="/" replace />
  if (state.selectedWeeks.length === 0) {
    return <Navigate to={getCoursePath(state.courseId)} replace />
  }

  const { selectedWeeks, difficulty, questionCount, durationMinutes } = state
  const { isAssignment } = course
  const weekCount = selectedWeeks.length
  const maxTotalCount = getMaxTestQuestionCount(selectedWeeks, difficulty)
  const totalAssignmentQuestions = isAssignment
    ? selectedWeeks.reduce((total, week) => total + week.questions.length, 0)
    : 0
  const count = isAssignment
    ? (Number(questionCount) || Math.min(10, totalAssignmentQuestions))
    : Number(questionCount)
  const countIsValid = isAssignment
    ? Number.isInteger(count) && count > 0 && count <= totalAssignmentQuestions
    : (
        Number.isInteger(count) &&
        count >= weekCount &&
        count <= maxTotalCount &&
        count % weekCount === 0
      )
  const questionsPerWeek = countIsValid && !isAssignment ? count / weekCount : null
  const validDuration = durationOptions.includes(Number(durationMinutes))

  const assignmentQuestionCounts = totalAssignmentQuestions > 15
    ? [5, 10, 15, totalAssignmentQuestions]
    : [5, 10, 15]

  function onStart() {
    const finalCount = isAssignment
      ? Math.min(Number(questionCount) || 10, totalAssignmentQuestions)
      : Number(questionCount)
    const finalDuration = Number(durationMinutes)
    const maxCount = getMaxTestQuestionCount(selectedWeeks, difficulty)
    if (
      (isAssignment && (
        !Number.isInteger(finalCount) ||
        finalCount <= 0 ||
        finalCount > totalAssignmentQuestions
      )) ||
      (!isAssignment && (
        !Number.isInteger(finalCount) ||
        finalCount < selectedWeeks.length ||
        finalCount > maxCount ||
        finalCount % selectedWeeks.length !== 0
      )) ||
      !durationOptions.includes(finalDuration)
    ) return

    dispatch({
      type: 'start-quiz',
      questionCount: finalCount,
      durationMinutes: finalDuration,
      difficulty: isAssignment ? 'Easy' : difficulty,
    })
    navigate(getCoursePath(state.courseId, 'quiz/1'))
  }

  return (
    <main className="mx-auto w-full max-w-295 px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <section className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-(--c-1e3445) px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--c-a7c6dc)">
          <Icon name="book" className="size-3.5" />
          Paper setup
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-(--c-dce7ef) sm:text-[48px] sm:leading-[1.08]">Set up your paper.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-(--c-a2b2bf) sm:text-base">
          {isAssignment
            ? 'Choose 5, 10, or 15 questions and a time limit to begin your assignment test.'
            : 'Choose a difficulty and total question count. The questions will be split evenly across your selected weeks.'}
        </p>
      </section>

      <section className="mx-auto w-full max-w-xl rounded-2xl border border-(--c-2b3b49) bg-(--c-182633) p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] sm:p-7">
        <button
          type="button"
          onClick={() => navigate(getCoursePath(state.courseId))}
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-(--c-203d52) px-4 text-sm font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.22)] transition-colors hover:bg-(--c-2b526d) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) active:scale-[0.98] sm:mb-6 sm:min-h-10"
        >
          <Icon name="back" className="size-4" />
          Back to week selection
        </button>

        <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-(--c-91a4b3)">Step 02</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-(--c-dce7ef)">
          {isAssignment ? 'Assignment Quiz Setup' : 'Practice Paper Setup'}
        </h2>

        <div className="mt-4 rounded-xl border border-(--c-354958) bg-(--c-14212c) p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--c-2b3b49) pb-2.5">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--c-a7c6dc)">
              <Icon name="book" className="size-3.5 text-(--c-82aecb)" />
              {isAssignment ? 'Included Assignments' : 'Included Weeks'}
            </span>
            <span className="rounded-full bg-(--c-203d52) px-2.5 py-0.5 text-[11px] font-bold text-(--c-c8dfed)">
              {isAssignment
                ? `Assignments: ${selectedWeeks.map((w) => w.week).join(', ')}`
                : `Weeks: ${selectedWeeks.map((w) => w.week).join(', ')}`}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedWeeks.map((week) => (
              <span
                key={week.week}
                className="inline-flex items-center gap-1.5 rounded-lg border border-(--c-354958) bg-(--c-202f3c) px-2.5 py-1 text-xs text-(--c-dce7ef)"
              >
                <span className="font-bold text-(--c-82aecb)">
                  {isAssignment ? `Assignment ${week.week}` : `Week ${week.week}`}
                </span>
                <span className="text-[10px] text-(--c-9aabba)">({week.questions.length} Qs)</span>
              </span>
            ))}
          </div>

          <p className="mt-3 text-xs leading-5 text-(--c-a2b2bf)">
            {isAssignment
              ? `${count} questions will be randomly selected from your selected ${selectedWeeks.length === 1 ? 'assignment' : 'assignments'} (${totalAssignmentQuestions} questions available).`
              : `Questions will be evenly selected from the ${selectedWeeks.length} selected ${selectedWeeks.length === 1 ? 'week' : 'weeks'}.`}
          </p>
        </div>

        {!isAssignment && <fieldset className="mt-6">
          <legend className="mb-2.5 text-xs font-bold text-(--c-bdcbd5)">Difficulty</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {difficultyOptions.map((option) => {
              const availableTotal = getMaxTestQuestionCount(selectedWeeks, option)
              const active = difficulty === option
              return (
                <button
                  key={option}
                  type="button"
                  disabled={availableTotal === 0}
                  onClick={() => dispatch({ type: 'set-difficulty', difficulty: option })}
                  aria-pressed={active}
                  className={`min-h-11 rounded-xl border px-3 py-3 text-left transition-colors duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-0 ${
                    active
                      ? 'border-(--c-39708f) bg-(--c-24516d) text-white shadow-[0_6px_16px_rgba(0,0,0,0.22)] hover:bg-(--c-2c6383)'
                      : 'border-(--c-354958) bg-(--c-202f3c) text-(--c-c3d0da) hover:border-(--c-52738a) hover:bg-(--c-293d4d) hover:shadow-[0_6px_15px_rgba(0,0,0,0.2)]'
                  }`}
                >
                  <span className={`block text-xs font-bold ${active ? 'text-white' : 'text-(--c-c3d0da)'}`}>{option}</span>
                  <span className={`mt-1 block text-[10px] ${active ? 'text-white/75' : 'text-(--c-9aabba)'}`}>
                    {option === 'Mixed' ? 'Easy and Medium/Hard' : `up to ${Math.floor(availableTotal / weekCount)} per week`}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>}

        {!isAssignment && <>
          <label htmlFor="question-count" className="mt-5 block text-xs font-bold text-(--c-bdcbd5)">Total number of questions</label>
          <div className="mt-2 flex max-w-sm items-center gap-2">
            <NumberStepper
              id="question-count"
              label="Total number of questions"
              value={questionCount}
              min={weekCount}
              max={maxTotalCount}
              step={weekCount}
              onChange={(count) => dispatch({ type: 'set-question-count', count })}
            />
            <span className="shrink-0 text-[10px] text-(--c-9aabba) sm:text-xs">max {maxTotalCount}</span>
          </div>
          <p id="count-hint" className={`mt-2 text-[11px] leading-4 ${countIsValid ? 'text-(--c-9aabba)' : 'text-(--c-e59a90)'}`}>
            {countIsValid
              ? `${questionsPerWeek} questions × ${weekCount} ${weekCount === 1 ? 'week' : 'weeks'} = ${count} total.`
              : `Enter a total divisible by ${weekCount}, between ${weekCount} and ${maxTotalCount}.`}
          </p>
        </>}

        {isAssignment && (
          <fieldset className="mt-6">
            <legend className="text-xs font-bold text-(--c-bdcbd5)">Number of questions</legend>
            <div className={`mt-2 grid gap-2 ${totalAssignmentQuestions > 15 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              {assignmentQuestionCounts.map((opt) => {
                const isAllOption = opt === totalAssignmentQuestions && opt > 15
                const active = Number(count) === opt
                const disabled = totalAssignmentQuestions < opt
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={disabled}
                    onClick={() => dispatch({ type: 'set-question-count', count: opt })}
                    aria-pressed={active}
                    className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) ${
                      active
                        ? 'border-(--c-39708f) bg-(--c-24516d) text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                        : 'border-(--c-354958) bg-(--c-202f3c) text-(--c-c3d0da) hover:border-(--c-52738a) hover:bg-(--c-293d4d) disabled:cursor-not-allowed disabled:opacity-40'
                    }`}
                  >
                    {isAllOption ? `All (${opt})` : `${opt} questions`}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-[11px] leading-4 text-(--c-9aabba)">
              Choose 5, 10, or 15 questions per test.
            </p>
          </fieldset>
        )}

        <fieldset className={`${isAssignment ? 'mt-6' : 'mt-5'}`}>
          <legend className="text-xs font-bold text-(--c-bdcbd5)">Time limit</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {durationOptions.map((minutes) => {
              const active = Number(durationMinutes) === minutes
              return (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => dispatch({ type: 'set-duration', minutes })}
                  aria-pressed={active}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) ${
                    active
                      ? 'border-(--c-39708f) bg-(--c-24516d) text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                      : 'border-(--c-354958) bg-(--c-202f3c) text-(--c-c3d0da) hover:border-(--c-52738a) hover:bg-(--c-293d4d)'
                  }`}
                >
                  {minutes} min
                </button>
              )
            })}
          </div>
          <p className={`mt-2 text-[11px] leading-4 ${validDuration ? 'text-(--c-9aabba)' : 'text-(--c-e59a90)'}`}>
            Choose between 5 and 180 minutes.
          </p>
        </fieldset>

        {!isAssignment && (
          <div className="mt-6 rounded-xl bg-(--c-202f3c) p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-(--c-bdcbd5)">
              <Icon name="clock" className="size-4 text-(--c-82aecb)" />
              Questions are randomly selected from each week and shuffled for this paper
            </div>
            <p className="mt-1.5 pl-6 text-[11px] leading-4 text-(--c-9aabba)">Each week contributes the same number of questions. You can submit whenever you are ready.</p>
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-(--c-2d3e4b) pt-4 sm:flex-row sm:border-0 sm:pt-1">
          <button
            type="button"
            onClick={() => dispatch({ type: 'reset-paper' })}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--c-394c5b) bg-(--c-202f3c) px-4 text-sm font-bold text-(--c-bdcbd5) transition-transform hover:bg-(--c-293d4d) active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) sm:order-1 sm:min-h-10 sm:w-auto"
          >
            <Icon name="reset" className="size-4" />
            Reset paper
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={!countIsValid || !validDuration}
            className="flex min-h-12 min-w-0 w-full items-center justify-center gap-2 rounded-xl bg-(--c-2d6485) px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.24)] transition-transform hover:bg-(--c-39799d) hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) disabled:cursor-not-allowed disabled:opacity-40 sm:order-2 sm:min-h-10 sm:w-auto sm:flex-1"
          >
            Start test
            <Icon name="arrow" className="size-4.5" />
          </button>
        </div>
      </section>
    </main>
  )
}

