import Icon from '../../components/Icon.jsx'

export default function WeekSelectionStep({
  weeks,
  selectedWeeks,
  onToggleWeek,
  onContinue,
  onReset,
  onCompletePaper,
}) {
  const selectedWeekNumbers = new Set(selectedWeeks.map((week) => week.week))

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      

      <section className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e3eff9] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#35658c]">
          <Icon name="book" className="size-3.5" />
          Practice at your pace
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#29465f] sm:text-[48px] sm:leading-[1.08]">Industry 4.0 & Industrial IoT</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#647f95] sm:text-base">
              Select one or more weeks. Your test will include the same number of questions from every selected week.
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#cbddeb] bg-[#eaf2f8] px-3 text-xs font-bold text-[#46647c] transition-transform hover:bg-[#e0edf6] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] sm:min-h-10 sm:min-w-0"
          >
            <Icon name="reset" className="size-4" />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d4e2ed] bg-[#edf4f9] p-4 shadow-[0_10px_35px_rgba(30,74,108,0.045)] sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#7892a7]">Step 01</p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#29465f]">Choose weeks</h2>
          </div>
          <p className="pb-1 text-xs font-medium text-[#7890a3]">{selectedWeeks.length} selected</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
          {weeks.map((week) => {
            const active = selectedWeekNumbers.has(week.week)
            const cannotDeselect = active && selectedWeeks.length === 1
            return (
              <button
                key={week.week}
                type="button"
                onClick={() => onToggleWeek(week)}
                disabled={cannotDeselect}
                aria-pressed={active}
                aria-label={`${active ? 'Remove' : 'Add'} Week ${week.week}${cannotDeselect ? '; at least one week must remain selected' : ''}`}
                className={`min-h-[98px] rounded-xl border p-3 text-left transition-colors duration-150 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] disabled:cursor-not-allowed ${
                  active
                    ? 'border-[#163b59] bg-[#245984] text-white shadow-[0_6px_16px_rgba(22,59,89,0.24)] hover:bg-[#163b59]'
                    : 'border-[#c4d8e7] bg-[#e3edf5] text-[#35516a] hover:border-[#397ba6] hover:bg-[#b5d0e3] hover:shadow-[0_6px_15px_rgba(36,89,132,0.16)]'
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${active ? 'text-[#cce7ff]' : 'text-[#7892a7]'}`}>Week {String(week.week).padStart(2, '0')}</span>
                  {active && <Icon name="check" className="size-4 text-[#d9eafa]" />}
                </span>
                <span className="mt-2 block line-clamp-2 text-xs font-semibold leading-[1.45]">{week.topic_title}</span>
                <span className={`mt-2 block text-[10px] ${active ? 'text-white/70' : 'text-[#8499aa]'}`}>{week.questions.length} questions</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onCompletePaper}
          className="mt-4 flex w-full items-center justify-between gap-4 rounded-xl border border-[#8eafd0] bg-[#c9deed] p-4 text-left transition-colors duration-150 hover:border-[#397ba6] hover:bg-[#b4d0e3] hover:shadow-[0_8px_20px_rgba(36,89,132,0.18)] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] sm:px-5"
        >
          <span className="min-w-0">
            <span className="block text-sm font-bold text-[#244b70]">Complete paper</span>
            <span className="mt-1 block text-xs leading-5 text-[#617b93]">All {weeks.length} weeks · mixed questions · {weeks.length} questions total</span>
          </span>
          <span className="shrink-0 rounded-lg bg-[#d0e2f0] px-3 py-2 text-xs font-bold text-[#245984] shadow-sm">Start setup →</span>
        </button>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#d6e4ef] pt-4 sm:flex-row sm:justify-between sm:border-[#dce8f1] sm:pt-5">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#cbddeb] bg-[#e3edf5] px-4 text-sm font-bold text-[#46647c] transition-transform hover:bg-[#dce9f3] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] sm:min-h-10 sm:w-auto"
          >
            <Icon name="reset" className="size-4" />
            Reset selection
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={selectedWeeks.length === 0}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#245984] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(36,89,132,0.2)] transition-transform hover:bg-[#1d4b70] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#356da8] disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-10 sm:w-auto"
          >
            Continue to paper setup
            <Icon name="arrow" className="size-[18px]" />
          </button>
        </div>
      </section>
    </main>
  )
}
