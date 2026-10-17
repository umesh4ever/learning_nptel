import Icon from '../../components/Icon.jsx'

function formatElapsedTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const paddedMinutes = String(minutes).padStart(2, '0')
  const paddedSeconds = String(seconds).padStart(2, '0')

  return hours > 0
    ? `${hours}:${paddedMinutes}:${paddedSeconds}`
    : `${paddedMinutes}:${paddedSeconds}`
}

export default function ResultsScreen({
  quiz,
  selectedAnswers,
  correctCount,
  durationSeconds,
  onCreateTest,
}) {
  const totalQuestions = quiz.questions.length
  const attemptedCount = quiz.questions.filter(
    (question) => selectedAnswers[question.id] !== undefined,
  ).length
  const unansweredCount = totalQuestions - attemptedCount
  const exactScorePercentage = (correctCount / totalQuestions) * 100
  const scorePercentage = Math.round(exactScorePercentage)

  const resultConfig = exactScorePercentage === 100
    ? {
        badge: 'FLAWLESS VICTORY · 100%',
        headline: 'Deadly Headshot! Clean Sweep.',
        subtitle: 'Pure perfection. You dominated every single question with pinpoint accuracy.',
        glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        border: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        scoreColor: 'text-emerald-300',
        barColor: 'bg-emerald-400',
      }
    : exactScorePercentage > 80
      ? {
          badge: 'OUTSTANDING · DISTINCTION',
          headline: "Dominating Performance! You're Shining.",
          subtitle: 'Exceptional command of the syllabus. Just a couple of minor edges left to polish.',
          glow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
          border: 'border-cyan-500/30',
          badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          scoreColor: 'text-cyan-300',
          barColor: 'bg-cyan-400',
        }
      : exactScorePercentage > 50
        ? {
            badge: 'SOLID EFFORT · PASSING GRADE',
            headline: 'Solid Run, But you can go higher!',
            subtitle: 'Good foundation built! Review the tricky questions below to cement your knowledge.',
            glow: 'from-sky-500/20 via-indigo-500/10 to-transparent',
            border: 'border-sky-500/30',
            badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
            iconBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
            scoreColor: 'text-sky-300',
            barColor: 'bg-sky-400',
          }
        : {
            badge: 'COMBAT DEBRIEF · LEVEL UP',
            headline: 'Regroup, Reload & Conquer!',
            subtitle: 'Every master was once a beginner. Study the detailed answers below and come back stronger.',
            glow: 'from-rose-500/20 via-amber-500/10 to-transparent',
            border: 'border-rose-500/30',
            badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
            scoreColor: 'text-rose-300',
            barColor: 'bg-rose-400',
          }

  return (
    <main className="mx-auto w-full max-w-245 px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="font-bold uppercase tracking-[0.18em] text-(--c-9aabba)">
          Weeks {quiz.weeks.map((week) => week.week).join(', ')} <span className="px-2 text-(--c-6089a4)">/</span> Performance Report
        </p>
        <button
          type="button"
          onClick={onCreateTest}
          className="inline-flex items-center gap-1.5 font-bold text-(--c-82aecb) transition-colors hover:text-(--c-dce7ef)"
        >
          <span>New test</span>
          <Icon name="arrow" className="size-3.5" />
        </button>
      </div>

      {/* Hero Result Banner */}
      <section
        aria-label="Quiz summary"
        className={`relative isolate overflow-hidden rounded-3xl border ${resultConfig.border} bg-(--c-182633) p-6 text-center text-(--c-dce7ef) shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-10`}
      >
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-px -z-10 bg-gradient-to-b ${resultConfig.glow}`}
        />

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
          <span className={`inline-block size-1.5 rounded-full ${resultConfig.barColor}`} />
          <span className={resultConfig.scoreColor}>{resultConfig.badge}</span>
        </div>

        {/* Center Icon */}
        <div className="mt-6 flex justify-center">
          <div className={`grid size-16 place-items-center rounded-2xl border shadow-lg backdrop-blur-md ${resultConfig.iconBg}`}>
            <Icon name="award" className="size-8" />
          </div>
        </div>

        {/* Headline & Subtitle */}
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-4xl">
          {resultConfig.headline}
        </h1>
        <p className="mx-auto mt-2.5 max-w-lg text-sm leading-6 text-(--c-a2b2bf) sm:text-base">
          {resultConfig.subtitle}
        </p>

        {/* Score & Progress Highlight */}
        <div className="mx-auto mt-7 max-w-md">
          <div className="flex items-baseline justify-center gap-2">
            <span className={`text-5xl font-black tracking-tight sm:text-6xl ${resultConfig.scoreColor}`}>
              {scorePercentage}%
            </span>
            <span className="text-sm font-semibold text-(--c-9aabba)">
              ({correctCount} of {totalQuestions} correct)
            </span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-(--c-14212c)">
            <div
              className={`h-full rounded-full transition-all duration-700 ${resultConfig.barColor}`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-(--c-2b3b49) bg-(--c-14212c)/90 p-3.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-(--c-9aabba)">Correct</p>
            <p className="mt-1 text-xl font-extrabold text-(--c-dce7ef)">{correctCount}</p>
            <p className="mt-0.5 text-[10px] text-(--c-82aecb)">of {totalQuestions} total</p>
          </div>

          <div className="rounded-xl border border-(--c-2b3b49) bg-(--c-14212c)/90 p-3.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-(--c-9aabba)">Attempted</p>
            <p className="mt-1 text-xl font-extrabold text-(--c-dce7ef)">{attemptedCount}</p>
            <p className="mt-0.5 text-[10px] text-(--c-82aecb)">questions tried</p>
          </div>

          <div className="rounded-xl border border-(--c-2b3b49) bg-(--c-14212c)/90 p-3.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-(--c-9aabba)">Skipped</p>
            <p className="mt-1 text-xl font-extrabold text-(--c-dce7ef)">{unansweredCount}</p>
            <p className="mt-0.5 text-[10px] text-(--c-82aecb)">unanswered</p>
          </div>

          <div className="rounded-xl border border-(--c-2b3b49) bg-(--c-14212c)/90 p-3.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-(--c-9aabba)">Time Taken</p>
            <p className="mt-1 text-xl font-extrabold tabular-nums text-(--c-dce7ef)">{formatElapsedTime(durationSeconds)}</p>
            <p className="mt-0.5 text-[10px] text-(--c-82aecb)">elapsed time</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCreateTest}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--c-2d6485) px-6 text-sm font-bold text-white shadow-[0_6px_20px_rgba(45,100,133,0.35)] transition duration-150 hover:bg-(--c-39799d) active:scale-[0.98]"
          >
            <Icon name="reset" className="size-4" />
            <span>Create Another Test</span>
          </button>
        </div>
      </section>

      {/* Answer Review Section */}
      <section className="mt-10" aria-label="Question by question review">
        <div className="mb-5 flex items-end justify-between border-b border-(--c-2b3b49) pb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--c-91a4b3)">Detailed Analysis</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-(--c-dce7ef)">Review Your Answers</h2>
          </div>
          <span className="text-xs font-semibold text-(--c-a2b2bf)">
            {correctCount} / {totalQuestions} answered correctly
          </span>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[question.id]
            const isAnswered = userAnswer !== undefined
            const correct = String(userAnswer).toLowerCase() === String(question.correct_answer).toLowerCase()

            return (
              <article
                key={question.id}
                className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                  correct
                    ? 'border-emerald-500/30 bg-(--c-182633)'
                    : 'border-rose-500/30 bg-(--c-182633)'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                      correct
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {correct ? '✓' : '✗'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--c-91a4b3)">
                        Question {index + 1}
                      </span>
                      <span className="text-(--c-394c5b)">·</span>
                      <span className="rounded bg-(--c-1e3445) px-1.5 py-0.5 text-[10px] font-bold text-(--c-a7c6dc)">
                        Week {question.week_number}
                      </span>
                      <span className="text-[11px] font-medium text-(--c-9aabba)">
                        {question.topic_name}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-sm font-semibold leading-6 text-(--c-dce7ef) sm:text-base">
                      {question.question}
                    </h3>

                    {/* Answers Comparison */}
                    <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                      <div className={`rounded-xl border p-3 text-xs ${
                        correct
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                          : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                      }`}>
                        <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">
                          Your answer
                        </span>
                        <p className="mt-1 font-semibold">
                          {isAnswered
                            ? `${userAnswer.toUpperCase()}: ${question.options[userAnswer] ?? question.options[userAnswer.toLowerCase()] ?? ''}`
                            : 'Not answered'}
                        </p>
                      </div>

                      {!correct && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-200">
                          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">
                            Correct answer
                          </span>
                          <p className="mt-1 font-semibold">
                            {question.correct_answer.toUpperCase()}: {question.options[question.correct_answer] ?? question.options[question.correct_answer.toLowerCase()] ?? ''}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Justification / Explanation */}
                    {question.justification && (
                      <div className="mt-3 rounded-xl border border-(--c-2b3b49) bg-(--c-14212c) p-3 text-xs leading-5 text-(--c-a2b2bf)">
                        <span className="font-bold text-(--c-a7c6dc)">Explanation: </span>
                        <span>{question.justification}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
