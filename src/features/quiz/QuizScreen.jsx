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
  theme,
  onToggleTheme,
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
    <main className="mx-auto w-full max-w-245 px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-(--c-20384a) px-3 py-1.5 text-[11px] font-bold text-(--c-a9c6da)">
          {quiz.difficulty} · Weeks {quiz.weeks.map((week) => week.week).join(', ')}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className={`grid size-11 place-items-center rounded-full border transition-colors active:scale-95 sm:size-9 ${
              theme === 'dark'
                ? 'border-(--c-405969) bg-(--c-263b4a) text-(--c-cfdae2) hover:bg-(--c-30495b)'
                : 'border-[#39708f] bg-[#24516d] text-white hover:bg-[#2c6383]'
            }`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="size-4" />
          </button>
          <div
            role={timeExpired ? 'alert' : 'timer'}
            aria-live={timeExpired ? 'assertive' : 'off'}
            className={`rounded-full px-3 py-2 text-xs font-bold tabular-nums ${
              timeExpired ? 'bg-(--c-452c2d) text-(--c-edb3ad)' : 'bg-(--c-1c2b38) text-(--c-bdcbd5) ring-1 ring-(--c-344654)'
            }`}
          >
            {timeExpired ? 'Time is up' : `Time left · ${minutes}:${seconds}`}
          </div>
          <button
            type="button"
            onClick={() => setConfirmQuit(true)}
            className="min-h-11 rounded-full border border-(--c-684242) bg-(--c-38272a) px-3 text-xs font-bold text-(--c-e5aaa3) transition-transform hover:bg-(--c-493033) active:scale-95 sm:min-h-9"
          >
            Quit test
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-(--c-91a4b3)">
            Week {question.week_number} · {question.week_title}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--c-dce7ef)">
            Question {questionIndex + 1}<span className="text-(--c-8195a5)"> / {quiz.questions.length}</span>
          </h1>
        </div>
        <p className="hidden text-xs font-medium text-(--c-9aabba) sm:block">{answeredCount} of {quiz.questions.length} answered</p>
      </div>
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-(--c-263744)">
        <div className="h-full rounded-full bg-(--c-5a91b2) transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <article className="rounded-2xl border border-(--c-2b3b49) bg-(--c-182633) p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-(--c-243746) px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--c-a9c6da)">{question.id}</span>
          <span className="text-[11px] font-medium text-(--c-9aabba)">{question.topic_name}</span>
        </div>
        <h2 className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-(--c-dce7ef) sm:text-[21px] sm:leading-9">{question.question}</h2>

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
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-transform duration-200 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-356da8) disabled:cursor-not-allowed sm:gap-4 sm:p-4 ${
                  chosen
                    ? 'border-(--c-163b59) bg-(--c-245984) shadow-[0_8px_18px_rgba(22,59,89,0.28)]'
                    : 'border-(--c-354958) bg-(--c-202f3c) hover:border-(--c-52738a) hover:bg-(--c-293d4d)'
                }`}
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${chosen ? 'bg-white/15 text-white' : 'bg-(--c-304656) text-(--c-c3d0da)'}`}>{key}</span>
                <span className={`pt-1 text-sm leading-6 ${chosen ? 'font-semibold text-white' : 'text-(--c-c3d0da)'}`}>{value}</span>
              </button>
            )
          })}
        </div>

        <section className="mt-7 border-t border-(--c-2b3b49) pt-5" aria-label="Question navigation">
          <p className="mb-3 text-xs font-bold text-(--c-bdcbd5)">Questions</p>
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
                  className={`grid size-11 place-items-center rounded-lg border text-xs font-bold transition-colors duration-150 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-356da8) ${
                    active && answered
                      ? 'border-(--c-163b59) bg-(--c-245984) text-white shadow-[0_0_0_2px_#9fc5df,0_4px_12px_rgba(22,59,89,0.3)]'
                      : active
                        ? 'border-(--c-163b59) bg-(--c-163b59) text-white shadow-[0_4px_12px_rgba(22,59,89,0.3)]'
                        : answered
                          ? 'border-(--c-3978a4) bg-(--c-3978a4) text-white shadow-[0_3px_10px_rgba(57,120,164,0.2)]'
                          : 'border-(--c-354958) bg-(--c-202f3c) text-(--c-a9bac7) hover:border-(--c-52738a) hover:bg-(--c-293d4d)'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </section>

        <div className="mt-7 grid grid-cols-2 gap-2 border-t border-(--c-2b3b49) pt-4 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
          <button
            type="button"
            onClick={() => onQuestionChange(questionIndex - 1)}
            disabled={questionIndex === 0}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-(--c-405969) bg-(--c-263b4a) px-3 text-sm font-bold text-(--c-cfdae2) transition-all hover:border-(--c-5d7d91) hover:bg-(--c-30495b) active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32 sm:px-4"
          >
            <Icon name="back" className="size-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => onQuestionChange(questionIndex + 1)}
            disabled={questionIndex === quiz.questions.length - 1}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-(--c-467796) bg-(--c-2f6685) px-3 text-sm font-bold text-white transition-all hover:border-(--c-5588a7) hover:bg-(--c-39799d) active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:order-3 sm:min-w-32 sm:px-4"
          >
            Next
            <Icon name="arrow" className="size-4" />
          </button>
          <div className="col-span-2 flex flex-col items-stretch gap-2 sm:order-2 sm:ml-auto sm:flex-row sm:items-center sm:gap-3">
            <p className="text-center text-[11px] text-(--c-9aabba) sm:text-right">
              {quiz.questions.length - answeredCount > 0
                ? `${quiz.questions.length - answeredCount} unanswered will count as incorrect.`
                : 'All questions answered.'}
            </p>
            <button
              type="button"
              onClick={onSubmit}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-(--c-2d6485) px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-all hover:bg-(--c-39799d) hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)] active:scale-[0.98]"
            >
              Submit test <Icon name="check" className="size-4" />
            </button>
          </div>
        </div>
      </article>
      {confirmQuit && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-(--c-080e14)/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmQuit(false)
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="quit-test-title"
            aria-describedby="quit-test-description"
            className="w-full max-w-sm rounded-2xl border border-(--c-354958) bg-(--c-182633) p-5 shadow-2xl sm:p-6"
          >
            <h2 id="quit-test-title" className="text-lg font-bold text-(--c-dce7ef)">Quit this test?</h2>
            <p id="quit-test-description" className="mt-2 text-sm leading-6 text-(--c-a2b2bf)">
              Your answers will be discarded and you will return to week selection.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmQuit(false)}
                className="min-h-12 rounded-xl border border-(--c-394c5b) bg-(--c-202f3c) px-4 text-sm font-bold text-(--c-bdcbd5) transition-transform active:scale-[0.98]"
              >
                Keep testing
              </button>
              <button
                type="button"
                onClick={onQuit}
                className="min-h-12 rounded-xl bg-(--c-88464a) px-4 text-sm font-bold text-white transition-transform hover:bg-(--c-a35357) active:scale-[0.98]"
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
