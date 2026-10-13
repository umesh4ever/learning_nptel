import { useState } from 'react'
import Icon from '../../components/Icon.jsx'

export default function QuizScreen({
  quiz,
  questionIndex,
  selectedAnswers,
  answeredCount,
  progress,
  remainingSeconds,
  timeExpired,
  onAnswer,
  onQuestionChange,
  onSubmit,
  onQuit,
}) {
  const [confirmQuit, setConfirmQuit] = useState(false)
  const question = quiz.questions[questionIndex]
  const chosenAnswer = selectedAnswers[question.id]
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0')
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0')

  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-[#e3eff9] px-3 py-1.5 text-[11px] font-bold text-[#35658c]">
          {quiz.difficulty} · Weeks {quiz.weeks.map((week) => week.week).join(', ')}
        </span>
        <div className="flex items-center gap-2">
          <div
            role={timeExpired ? 'alert' : 'timer'}
            aria-live={timeExpired ? 'assertive' : 'off'}
            className={`rounded-full px-3 py-2 text-xs font-bold tabular-nums ${
              timeExpired ? 'bg-[#fae8e5] text-[#aa544a]' : 'bg-[#eaf2f8] text-[#35516a] ring-1 ring-[#d4e2ed]'
            }`}
          >
            {timeExpired ? 'Time is up' : `Time left · ${minutes}:${seconds}`}
          </div>
          <button
            type="button"
            onClick={() => setConfirmQuit(true)}
            className="min-h-11 rounded-full border border-[#e1c9c5] bg-[#f6eae8] px-3 text-xs font-bold text-[#994d46] transition-transform hover:bg-[#f2dfdc] active:scale-95 sm:min-h-9"
          >
            Quit test
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#7892a7]">
            Week {question.week_number} · {question.week_title}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#29465f]">
            Question {questionIndex + 1}<span className="text-[#9aafc0]"> / {quiz.questions.length}</span>
          </h1>
        </div>
        <p className="hidden text-xs font-medium text-[#7890a3] sm:block">{answeredCount} of {quiz.questions.length} answered</p>
      </div>
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-[#dce8f1]">
        <div className="h-full rounded-full bg-[#528fba] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <article className="rounded-2xl border border-[#d4e2ed] bg-[#edf4f9] p-4 shadow-[0_10px_35px_rgba(30,74,108,0.045)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[#edf5fb] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#466c89]">{question.id}</span>
          <span className="text-[11px] font-medium text-[#7890a3]">{question.topic_name}</span>
        </div>
        <h2 className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[#29465f] sm:text-[21px] sm:leading-9">{question.question}</h2>

        <div className="mt-7 space-y-3">
          {Object.entries(question.options).map(([key, value]) => {
            const chosen = chosenAnswer === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onAnswer(question.id, key)}
                disabled={timeExpired}
                aria-pressed={chosen}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-transform duration-200 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] disabled:cursor-not-allowed sm:gap-4 sm:p-4 ${
                  chosen
                    ? 'border-[#163b59] bg-[#245984] shadow-[0_8px_18px_rgba(22,59,89,0.28)]'
                    : 'border-[#c4d8e7] bg-[#dce9f2] hover:border-[#397ba6] hover:bg-[#b5d0e3]'
                }`}
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${chosen ? 'bg-white/20 text-white' : 'bg-[#c8dce9] text-[#426784]'}`}>{key}</span>
                <span className={`pt-1 text-sm leading-6 ${chosen ? 'font-semibold text-white' : 'text-[#35516a]'}`}>{value}</span>
              </button>
            )
          })}
        </div>

        <section className="mt-7 border-t border-[#e8eff5] pt-5" aria-label="Question navigation">
          <p className="mb-3 text-xs font-bold text-[#46647c]">Questions</p>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((item, index) => {
              const answered = selectedAnswers[item.id] !== undefined
              const active = questionIndex === index
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onQuestionChange(index)}
                  aria-label={`Go to question ${index + 1}${answered ? ', answered' : ', not answered'}`}
                  aria-current={active ? 'step' : undefined}
                  className={`grid size-11 place-items-center rounded-lg border text-xs font-bold transition-colors duration-150 active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] ${
                    active && answered
                      ? 'border-[#163b59] bg-[#245984] text-white shadow-[0_0_0_2px_#9fc5df,0_4px_12px_rgba(22,59,89,0.3)]'
                      : active
                        ? 'border-[#163b59] bg-[#163b59] text-white shadow-[0_4px_12px_rgba(22,59,89,0.3)]'
                        : answered
                          ? 'border-[#3978a4] bg-[#3978a4] text-white shadow-[0_3px_10px_rgba(57,120,164,0.2)]'
                          : 'border-[#c4d8e7] bg-[#dce9f2] text-[#57738a] hover:border-[#5a8eb5] hover:bg-[#b9d2e5]'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </section>

        <div className="mt-7 grid grid-cols-2 gap-2 border-t border-[#d2e0eb] pt-4 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
          <button
            type="button"
            onClick={() => onQuestionChange(questionIndex - 1)}
            disabled={questionIndex === 0}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#9ab7ce] bg-[#d5e5f0] px-3 text-sm font-bold text-[#294f6d] transition-all hover:border-[#5682a3] hover:bg-[#bfd5e5] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-32 sm:px-4"
          >
            <Icon name="back" className="size-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => onQuestionChange(questionIndex + 1)}
            disabled={questionIndex === quiz.questions.length - 1}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#4d82a7] bg-[#3978a4] px-3 text-sm font-bold text-white transition-all hover:border-[#245984] hover:bg-[#245984] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 sm:order-3 sm:min-w-32 sm:px-4"
          >
            Next
            <Icon name="arrow" className="size-4" />
          </button>
          <div className="col-span-2 flex flex-col items-stretch gap-2 sm:order-2 sm:ml-auto sm:flex-row sm:items-center sm:gap-3">
            <p className="text-center text-[11px] text-[#617b93] sm:text-right">
              {quiz.questions.length - answeredCount > 0
                ? `${quiz.questions.length - answeredCount} unanswered will count as incorrect.`
                : 'All questions answered.'}
            </p>
            <button
              type="button"
              onClick={onSubmit}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#245984] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(36,89,132,0.28)] transition-all hover:bg-[#163b59] hover:shadow-[0_10px_24px_rgba(22,59,89,0.35)] active:scale-[0.98]"
            >
              Submit test <Icon name="check" className="size-4" />
            </button>
          </div>
        </div>
      </article>
      {confirmQuit && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#18344a]/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmQuit(false)
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="quit-test-title"
            aria-describedby="quit-test-description"
            className="w-full max-w-sm rounded-2xl border border-[#d4e2ed] bg-[#edf4f9] p-5 shadow-2xl sm:p-6"
          >
            <h2 id="quit-test-title" className="text-lg font-bold text-[#29465f]">Quit this test?</h2>
            <p id="quit-test-description" className="mt-2 text-sm leading-6 text-[#647f95]">
              Your answers will be discarded and you will return to week selection.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmQuit(false)}
                className="min-h-12 rounded-xl border border-[#cbddeb] bg-[#e3edf5] px-4 text-sm font-bold text-[#46647c] transition-transform active:scale-[0.98]"
              >
                Keep testing
              </button>
              <button
                type="button"
                onClick={onQuit}
                className="min-h-12 rounded-xl bg-[#a34e47] px-4 text-sm font-bold text-white transition-transform hover:bg-[#8f403b] active:scale-[0.98]"
              >
                Quit test
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
