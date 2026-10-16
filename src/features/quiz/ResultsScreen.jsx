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
  const attemptedCount = quiz.questions.filter(
    (question) => selectedAnswers[question.id] !== undefined,
  ).length
  const unansweredCount = quiz.questions.length - attemptedCount
  const exactScorePercentage = (correctCount / quiz.questions.length) * 100
  const scorePercentage = Math.round(exactScorePercentage)
  const resultHeadline = exactScorePercentage === 100
    ? 'Deadly Head shot man'
    : exactScorePercentage > 80
      ? 'Excellent you are shining'
      : exactScorePercentage > 50
        ? 'Great But you have miles to go'
        : 'Go home prepare then return and Conquer'
  const resultTheme = exactScorePercentage <= 50
    ? {
        section: 'bg-(--c-632f36)',
        icon: 'bg-(--c-82454b) text-(--c-f0c9c6)',
        highlight: 'text-(--c-f0c9c6)',
      }
    : exactScorePercentage > 80
      ? {
          section: 'bg-(--c-214d40)',
          icon: 'bg-(--c-326653) text-(--c-c5e2d1)',
          highlight: 'text-(--c-c5e2d1)',
        }
      : {
          section: 'bg-(--c-21445c)',
          icon: 'bg-(--c-315a75) text-(--c-c9deec)',
          highlight: 'text-(--c-c9deec)',
        }

  return (
    <main className="mx-auto w-full max-w-245 px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <p className="text-xs font-bold uppercase tracking-[0.19em] text-(--c-9aabba)">
        Weeks {quiz.weeks.map((week) => week.week).join(', ')} <span className="px-2 text-(--c-b9cde0)">/</span> Test results
      </p>
      <section className={`mt-8 rounded-3xl px-5 py-8 text-center text-white shadow-[0_12px_30px_rgba(22,59,89,0.16)] ${resultTheme.section} sm:px-10 sm:py-12`}>
        <div className={`mx-auto grid size-14 place-items-center rounded-2xl ${resultTheme.icon}`}>
          <Icon name="award" className="size-7" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/55">Test complete</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{resultHeadline}</h1>
        <p className="mt-3 text-sm text-white/80">You got <strong className={resultTheme.highlight}>{correctCount} of {quiz.questions.length}</strong> questions correct.</p>
        <div className="mx-auto mt-7 flex max-w-lg items-center justify-center gap-5 rounded-2xl bg-black/15 px-4 py-4 sm:gap-8 sm:px-6">
          <div><p className="text-2xl font-bold">{scorePercentage}%</p><p className="mt-1 text-[10px] uppercase tracking-widest text-white/65">Score</p></div>
          <div className="h-9 w-px bg-white/15" />
          <div><p className="text-2xl font-bold">{quiz.questions.length}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-white/45">Questions</p></div>
          <div className="h-9 w-px bg-white/15" />
          <div><p className="text-2xl font-bold tabular-nums">{formatElapsedTime(durationSeconds)}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-white/65">Time taken</p></div>
        </div>
        <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/15 px-3 py-3">
            <p className="text-xl font-bold">{attemptedCount}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">Attempted</p>
          </div>
          <div className="rounded-xl bg-black/15 px-3 py-3">
            <p className="text-xl font-bold">{unansweredCount}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">Not answered</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-(--c-91a4b3)">Review</p><h2 className="mt-1 text-xl font-semibold text-(--c-d6e1e9)">Your answers</h2></div>
          <button type="button" onClick={onCreateTest} className="text-xs font-bold text-(--c-82aecb) hover:text-(--c-b2d0e2)">Create another test</button>
        </div>
        <div className="space-y-3">
          {quiz.questions.map((question, index) => {
            const correct = selectedAnswers[question.id] === question.correct_answer
            return (
              <article key={question.id} className="rounded-2xl border border-(--c-2b3b49) bg-(--c-182633) p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${correct ? 'bg-(--c-294339) text-(--c-a7d4b8)' : 'bg-(--c-452c2d) text-(--c-edb3ad)'}`}>
                    {correct ? <Icon name="check" className="size-4" /> : '×'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--c-91a4b3)">
                      Question {index + 1} · Week {question.week_number} · {question.topic_name}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold leading-6 text-(--c-d6e1e9)">{question.question}</h3>
                    <p className="mt-3 text-xs leading-5 text-(--c-b2c0ca)">
                      Your answer: <strong className={correct ? 'text-(--c-a7d4b8)' : 'text-(--c-edb3ad)'}>{question.options[selectedAnswers[question.id]] ?? 'Not answered'}</strong>
                    </p>
                    {!correct && (
                      <p className="mt-1 text-xs leading-5 text-(--c-a2b2bf)">
                        Correct answer: <strong className="text-(--c-a7d4b8)">{question.options[question.correct_answer]}</strong>
                      </p>
                    )}
                    {question.justification && (
                      <p className="mt-3 rounded-lg bg-(--c-202f38) px-3 py-2.5 text-xs leading-5 text-(--c-aab9c1)">{question.justification}</p>
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
