import Icon from '../../components/Icon.jsx'
import { difficultyOptions, getMaxTestQuestionCount } from '../../data/courseData.js'

function NumberStepper({ id, label, value, min, max, step, suffix, onChange }) {
  const numericValue = Number(value)
  const canDecrement = Number.isFinite(numericValue) && numericValue > min
  const canIncrement = max === undefined || !Number.isFinite(numericValue) || numericValue < max

  return (
    <div className="flex h-12 w-full items-center rounded-lg border border-[#cbddeb] bg-[#eaf2f8] p-1 focus-within:border-[#6e9bc0] focus-within:ring-2 focus-within:ring-[#d8eafa]/60 sm:h-10">
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={!canDecrement}
        onClick={() => onChange(Math.max(min, (Number.isFinite(numericValue) ? numericValue : min) - step))}
        className="grid size-11 shrink-0 place-items-center rounded-md bg-[#dceaf5] text-base font-bold text-[#315b7c] transition-transform hover:bg-[#d2e3f0] active:scale-90 disabled:cursor-not-allowed disabled:opacity-35 sm:size-8"
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
        className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent px-1 text-center text-sm font-semibold tabular-nums text-[#29465f] outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:text-xs"
      />
      {suffix && <span className="hidden shrink-0 pr-2 text-xs text-[#7890a3] sm:block">{suffix}</span>}
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={!canIncrement}
        onClick={() => onChange((Number.isFinite(numericValue) ? numericValue : min) + step)}
        className="grid size-11 shrink-0 place-items-center rounded-md bg-[#245984] text-base font-bold text-white transition-colors hover:bg-[#163b59] active:scale-90 disabled:cursor-not-allowed disabled:opacity-35 sm:size-8"
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
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <div className="mb-9 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#647f95]">Your learning space <span className="px-2 text-[#b9cde0]">/</span> Weekly tests</p>
        <div className="hidden items-center gap-2 rounded-full border border-[#dce8f1] bg-white px-3 py-2 text-xs font-semibold text-[#46647c] sm:flex">
          <span className="size-2 rounded-full bg-[#528fba]" />
          {weekCount} {weekCount === 1 ? 'week' : 'weeks'} selected
        </div>
      </div>

      <section className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e3eff9] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#35658c]">
          <Icon name="book" className="size-3.5" />
          Paper setup
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#29465f] sm:text-[48px] sm:leading-[1.08]">Set up your paper.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#647f95] sm:text-base">
          Choose a difficulty and total question count. The questions will be split evenly across your selected weeks.
        </p>
      </section>

      <section className="mx-auto w-full max-w-xl rounded-2xl border border-[#d4e2ed] bg-[#edf4f9] p-4 shadow-[0_10px_35px_rgba(30,74,108,0.045)] sm:p-7">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#163b59] px-4 text-sm font-bold text-white shadow-[0_4px_12px_rgba(22,59,89,0.2)] transition-colors hover:bg-[#245984] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] active:scale-[0.98] sm:mb-6 sm:min-h-10"
        >
          <Icon name="back" className="size-4" />
          Back to week selection
        </button>

        <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#7892a7]">Step 02</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#29465f]">Choose difficulty and count</h2>
        <div className="mt-2 space-y-1 text-xs leading-5 text-[#7890a3]">
          {selectedWeeks.map((week) => (
            <p key={week.week}>Week {week.week} · {week.topic_title}</p>
          ))}
        </div>

        <fieldset className="mt-6">
          <legend className="mb-2.5 text-xs font-bold text-[#46647c]">Difficulty</legend>
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
                      ? 'border-[#163b59] bg-[#245984] text-white shadow-[0_6px_16px_rgba(22,59,89,0.22)] hover:bg-[#163b59]'
                      : 'border-[#c4d8e7] bg-[#e3edf5] text-[#35516a] hover:border-[#397ba6] hover:bg-[#b5d0e3] hover:shadow-[0_6px_15px_rgba(36,89,132,0.16)]'
                  }`}
                >
                  <span className={`block text-xs font-bold ${active ? 'text-white' : 'text-[#35516a]'}`}>{option}</span>
                  <span className={`mt-1 block text-[10px] ${active ? 'text-white/75' : 'text-[#647f95]'}`}>
                    {option === 'Mixed' ? 'Easy and Medium/Hard' : `up to ${Math.floor(availableTotal / weekCount)} per week`}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <label htmlFor="question-count" className="mt-5 block text-xs font-bold text-[#46647c]">Total number of questions</label>
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
          <span className="shrink-0 text-[10px] text-[#7890a3] sm:text-xs">max {maxTotalCount}</span>
        </div>
        <p id="count-hint" className={`mt-2 text-[11px] leading-4 ${countIsValid ? 'text-[#7890a3]' : 'text-[#a45046]'}`}>
          {countIsValid
            ? `${questionsPerWeek} questions × ${weekCount} ${weekCount === 1 ? 'week' : 'weeks'} = ${count} total.`
            : `Enter a total divisible by ${weekCount}, between ${weekCount} and ${maxTotalCount}.`}
        </p>

        <label htmlFor="test-duration" className="mt-5 block text-xs font-bold text-[#46647c]">Time limit</label>
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
        <p id="duration-hint" className={`mt-2 text-[11px] leading-4 ${Number.isInteger(Number(durationMinutes)) && Number(durationMinutes) >= 5 && Number(durationMinutes) % 5 === 0 ? 'text-[#7890a3]' : 'text-[#a45046]'}`}>
          Choose a duration in 5-minute increments.
        </p>

        <div className="mt-6 rounded-xl bg-[#f2f7fb] p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#46647c]">
            <Icon name="clock" className="size-4 text-[#528fba]" />
            Questions follow course order within each difficulty
          </div>
          <p className="mt-1.5 pl-6 text-[11px] leading-4 text-[#7890a3]">Each week contributes the same number of questions. You can submit whenever you are ready.</p>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#d6e4ef] pt-4 sm:flex-row sm:border-0 sm:pt-1">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#cbddeb] bg-[#e3edf5] px-4 text-sm font-bold text-[#46647c] transition-transform hover:bg-[#dce9f3] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] sm:order-1 sm:min-h-10 sm:w-auto"
          >
            <Icon name="reset" className="size-4" />
            Reset paper
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={!countIsValid || !Number.isInteger(Number(durationMinutes)) || Number(durationMinutes) < 5 || Number(durationMinutes) % 5 !== 0}
            className="flex min-h-12 min-w-0 w-full items-center justify-center gap-2 rounded-xl bg-[#245984] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(36,89,132,0.2)] transition-transform hover:bg-[#1d4b70] hover:shadow-[0_10px_24px_rgba(36,89,132,0.25)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] disabled:cursor-not-allowed disabled:opacity-40 sm:order-2 sm:min-h-10 sm:w-auto sm:flex-1"
          >
            Start test
            <Icon name="arrow" className="size-[18px]" />
          </button>
        </div>
      </section>
    </main>
  )
}
