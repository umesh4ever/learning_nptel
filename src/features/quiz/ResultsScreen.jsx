import Icon from '../../components/Icon.jsx'

export default function ResultsScreen({ quiz, selectedAnswers, correctCount, onCreateTest }) {
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
        section: 'bg-[#a33e46]',
        icon: 'bg-[#f8dfe1] text-[#8c3038]',
        highlight: 'text-[#ffd9dc]',
      }
    : exactScorePercentage > 80
      ? {
          section: 'bg-[#21634c]',
          icon: 'bg-[#d9f0e4] text-[#21634c]',
          highlight: 'text-[#d9f0e4]',
        }
      : {
          section: 'bg-[#245984]',
          icon: 'bg-[#d9eafa] text-[#245984]',
          highlight: 'text-[#d9eafa]',
        }

  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#647f95]">
        Weeks {quiz.weeks.map((week) => week.week).join(', ')} <span className="px-2 text-[#b9cde0]">/</span> Test results
      </p>
      <section className={`mt-8 rounded-3xl px-5 py-8 text-center text-white shadow-[0_12px_30px_rgba(22,59,89,0.16)] ${resultTheme.section} sm:px-10 sm:py-12`}>
        <div className={`mx-auto grid size-14 place-items-center rounded-2xl ${resultTheme.icon}`}>
          <Icon name="award" className="size-7" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/55">Test complete</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{resultHeadline}</h1>
        <p className="mt-3 text-sm text-white/80">You got <strong className={resultTheme.highlight}>{correctCount} of {quiz.questions.length}</strong> questions correct.</p>
        <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-8 rounded-2xl bg-white/[0.07] px-6 py-4">
          <div><p className="text-2xl font-bold">{scorePercentage}%</p><p className="mt-1 text-[10px] uppercase tracking-widest text-white/45">Score</p></div>
          <div className="h-9 w-px bg-white/15" />
          <div><p className="text-2xl font-bold">{quiz.questions.length}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-white/45">Questions</p></div>
        </div>
        <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/[0.1] px-3 py-3">
            <p className="text-xl font-bold">{attemptedCount}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">Attempted</p>
          </div>
          <div className="rounded-xl bg-white/[0.1] px-3 py-3">
            <p className="text-xl font-bold">{unansweredCount}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">Not answered</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#7892a7]">Review</p><h2 className="mt-1 text-xl font-semibold text-[#29465f]">Your answers</h2></div>
          <button type="button" onClick={onCreateTest} className="text-xs font-bold text-[#356da8] hover:text-[#245984]">Create another test</button>
        </div>
        <div className="space-y-3">
          {quiz.questions.map((question, index) => {
            const correct = selectedAnswers[question.id] === question.correct_answer
            return (
              <article key={question.id} className="rounded-2xl border border-[#d4e2ed] bg-[#edf4f9] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${correct ? 'bg-[#e8f2dc] text-[#527538]' : 'bg-[#fae8e5] text-[#aa544a]'}`}>
                    {correct ? <Icon name="check" className="size-4" /> : '×'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#7892a7]">
                      Question {index + 1} · Week {question.week_number} · {question.topic_name}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold leading-6 text-[#2d3a32]">{question.question}</h3>
                    <p className="mt-3 text-xs leading-5 text-[#526d83]">
                      Your answer: <strong className={correct ? 'text-[#527538]' : 'text-[#aa544a]'}>{question.options[selectedAnswers[question.id]] ?? 'Not answered'}</strong>
                    </p>
                    {!correct && (
                      <p className="mt-1 text-xs leading-5 text-[#6e7a72]">
                        Correct answer: <strong className="text-[#527538]">{question.options[question.correct_answer]}</strong>
                      </p>
                    )}
                    <p className="mt-3 rounded-lg bg-[#f5f7f2] px-3 py-2.5 text-xs leading-5 text-[#647168]">{question.justification}</p>
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
