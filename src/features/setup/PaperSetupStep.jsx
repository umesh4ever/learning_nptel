import Icon from '../../components/Icon.jsx'
import { difficultyOptions, getMaxTestQuestionCount } from '../../data/courseData.js'

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

export default function PaperSetupStep({
  selectedWeeks,
  difficulty,
  questionCount,
  durationMinutes,
  onDifficultyChange,
  onQuestionCountChange,
  onDurationChange,
  onBack,
  onReset,
  onStart,
}) {
  const weekCount = selectedWeeks.length
  const maxTotalCount = getMaxTestQuestionCount(selectedWeeks, difficulty)
  const count = Number(questionCount)
  const countIsValid =
    Number.isInteger(count) &&
    count >= weekCount &&
    count <= maxTotalCount &&
    count % weekCount === 0
  const questionsPerWeek = countIsValid ? count / weekCount : null

  return (
    <main className="mx-auto w-full max-w-295 px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      

      <section className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-(--c-1e3445) px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--c-a7c6dc)">
          <Icon name="book" className="size-3.5" />
          Paper setup
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-(--c-dce7ef) sm:text-[48px] sm:leading-[1.08]">Set up your paper.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-(--c-a2b2bf) sm:text-base">
          Choose a difficulty and total question count. The questions will be split evenly across your selected weeks.
        </p>
      </section>

      <section className="mx-auto w-full max-w-xl rounded-2xl border border-(--c-2b3b49) bg-(--c-182633) p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] sm:p-7">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-(--c-203d52) px-4 text-sm font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.22)] transition-colors hover:bg-(--c-2b526d) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) active:scale-[0.98] sm:mb-6 sm:min-h-10"
        >
          <Icon name="back" className="size-4" />
          Back to week selection
        </button>

        <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-(--c-91a4b3)">Step 02</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-(--c-d6e1e9)">Choose difficulty and count</h2>
        <div className="mt-2 space-y-1 text-xs leading-5 text-(--c-9aabba)">
          {selectedWeeks.map((week) => (
            <p key={week.week}>Week {week.week} · {week.topic_title}</p>
          ))}
        </div>

        <fieldset className="mt-6">
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
                  onClick={() => onDifficultyChange(option)}
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
        </fieldset>

        <label htmlFor="question-count" className="mt-5 block text-xs font-bold text-(--c-bdcbd5)">Total number of questions</label>
        <div className="mt-2 flex max-w-sm items-center gap-2">
          <NumberStepper
            id="question-count"
            label="Total number of questions"
            value={questionCount}
            min={weekCount}
            max={maxTotalCount}
            step={weekCount}
            onChange={onQuestionCountChange}
          />
          <span className="shrink-0 text-[10px] text-(--c-9aabba) sm:text-xs">max {maxTotalCount}</span>
        </div>
        <p id="count-hint" className={`mt-2 text-[11px] leading-4 ${countIsValid ? 'text-(--c-9aabba)' : 'text-(--c-e59a90)'}`}>
          {countIsValid
            ? `${questionsPerWeek} questions × ${weekCount} ${weekCount === 1 ? 'week' : 'weeks'} = ${count} total.`
            : `Enter a total divisible by ${weekCount}, between ${weekCount} and ${maxTotalCount}.`}
        </p>

        <label htmlFor="test-duration" className="mt-5 block text-xs font-bold text-(--c-bdcbd5)">Time limit</label>
        <div className="mt-2 flex max-w-xs items-center gap-2">
          <NumberStepper
            id="test-duration"
            label="Time limit"
            value={durationMinutes}
            min="5"
            step="5"
            suffix="minutes"
            onChange={onDurationChange}
          />
        </div>
        <p id="duration-hint" className={`mt-2 text-[11px] leading-4 ${Number.isInteger(Number(durationMinutes)) && Number(durationMinutes) >= 5 && Number(durationMinutes) % 5 === 0 ? 'text-(--c-9aabba)' : 'text-(--c-e59a90)'}`}>
          Choose a duration in 5-minute increments.
        </p>

        <div className="mt-6 rounded-xl bg-(--c-202f3c) p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-(--c-bdcbd5)">
            <Icon name="clock" className="size-4 text-(--c-82aecb)" />
            Questions are randomly selected from each week and shuffled for this paper
          </div>
          <p className="mt-1.5 pl-6 text-[11px] leading-4 text-(--c-9aabba)">Each week contributes the same number of questions. You can submit whenever you are ready.</p>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-(--c-2d3e4b) pt-4 sm:flex-row sm:border-0 sm:pt-1">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--c-394c5b) bg-(--c-202f3c) px-4 text-sm font-bold text-(--c-bdcbd5) transition-transform hover:bg-(--c-293d4d) active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-78a9c9) sm:order-1 sm:min-h-10 sm:w-auto"
          >
            <Icon name="reset" className="size-4" />
            Reset paper
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={!countIsValid || !Number.isInteger(Number(durationMinutes)) || Number(durationMinutes) < 5 || Number(durationMinutes) % 5 !== 0}
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
