import { Link, Navigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { getCourse, getCoursePath, getWeekNotes } from '../../data/courseData.js'

const commonWords = new Set([
  'about', 'after', 'again', 'also', 'among', 'because', 'being', 'both', 'each',
  'from', 'have', 'into', 'more', 'most', 'other', 'over', 'same', 'such', 'than',
  'that', 'their', 'there', 'these', 'they', 'this', 'those', 'through', 'under',
  'using', 'with', 'within', 'which', 'while', 'will', 'when', 'where', 'what',
  'does', 'provides', 'enables', 'allows', 'helps', 'used', 'uses', 'based',
])

function findKeyTerms(keyTerm, text) {
  const answerWords = keyTerm.match(/[A-Za-z0-9]+(?:[.+/-][A-Za-z0-9]+)*/g) ?? []
  const noteWords = [...text.matchAll(/[A-Za-z0-9]+(?:[.+/-][A-Za-z0-9]+)*/g)]
  const noteLookup = new Map(noteWords.map((match) => [match[0].toLowerCase(), match[0]]))

  for (let phraseLength = Math.min(4, answerWords.length); phraseLength >= 2; phraseLength -= 1) {
    for (let start = 0; start <= answerWords.length - phraseLength; start += 1) {
      const phrase = answerWords.slice(start, start + phraseLength)
      const phraseText = phrase.join(' ').toLowerCase()
      const noteIndex = text.toLowerCase().indexOf(phraseText)
      if (noteIndex >= 0) return phrase.map((word) => noteLookup.get(word.toLowerCase()) ?? word)
    }
  }

  return [...new Set(
    answerWords
      .filter((word) => word.length > 2 && !commonWords.has(word.toLowerCase()))
      .filter((word) => noteLookup.has(word.toLowerCase()))
      .map((word) => noteLookup.get(word.toLowerCase())),
  )].slice(0, 3)
}

function NoteText({ note }) {
  const terms = findKeyTerms(note.keyTerm, note.text)
  if (terms.length === 0) return note.text

  const termSet = new Set(terms.map((term) => term.toLowerCase()))
  const parts = note.text.split(/(\s+)/)

  return parts.map((part, index) => {
    const word = part.match(/[A-Za-z0-9]+(?:[.+/-][A-Za-z0-9]+)*/)?.[0]
    if (!word || !termSet.has(word.toLowerCase())) return part
    return (
      <strong
        key={`${index}-${word}`}
        className="font-bold text-(--c-d5e4ee) underline decoration-(--c-6089a4) underline-offset-4"
      >
        {part}
      </strong>
    )
  })
}

export default function WeekNotesPage() {
  const { courseId, weekNumber } = useParams()
  const course = getCourse(courseId)
  const week = course?.weeks.find((item) => item.week === Number(weekNumber))

  if (!course) return <Navigate to="/" replace />
  if (course.id !== 'iiot-4.0') return <Navigate to={getCoursePath(course.id)} replace />
  if (!week) return <Navigate to={getCoursePath(course.id, 'notes')} replace />

  const topics = getWeekNotes(week)
  const totalNotes = topics.reduce((total, topic) => total + topic.notes.length, 0)

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-12 pt-7 sm:px-8 lg:px-12 lg:pt-10">
      <Link
        to={getCoursePath(course.id, 'notes')}
        className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-(--c-a7c6dc) transition-colors hover:text-(--c-dce7ef) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--c-78a9c9)"
      >
        <Icon name="back" className="size-4" />
        All weekly notes
      </Link>

      <article className="overflow-hidden border border-(--c-394c5b) bg-(--c-182633) shadow-[0_16px_45px_rgba(0,0,0,0.2)]">
        <header className="border-b-2 border-(--c-6089a4) px-5 py-7 sm:px-10 sm:py-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--c-82aecb)">
            {course.name} <span className="px-1.5 text-(--c-52738a)">/</span> Week {String(week.week).padStart(2, '0')}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-(--c-dce7ef) sm:text-4xl">
            {week.topic_title}
          </h1>
          {week.topic_overview && (
            <p className="mt-5 max-w-3xl text-sm leading-7 text-(--c-b2c0ca) sm:text-base">
              {week.topic_overview}
            </p>
          )}
          <p className="mt-5 text-xs text-(--c-9aabba)">
            {topics.length} topics · {totalNotes} explanation notes
          </p>
        </header>

        <div className="px-5 sm:px-10">
          {topics.map((topic, topicIndex) => (
            <section
              key={`${week.week}-${topic.title}`}
              className="border-b border-(--c-2b3b49) py-7 last:border-b-0 sm:py-9"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-(--c-82aecb)">
                Topic {String(topicIndex + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-2 text-xl font-bold leading-snug text-(--c-dce7ef) sm:text-2xl">
                {topic.title}
              </h2>
              {topic.description && (
                <p className="mt-3 border-l-2 border-(--c-52738a) pl-4 text-sm italic leading-6 text-(--c-a2b2bf)">
                  {topic.description}
                </p>
              )}
              <div className="mt-5 space-y-4">
                {topic.notes.map((note, noteIndex) => (
                  <p
                    key={`${topic.title}-${noteIndex}`}
                    className="text-sm leading-7 text-(--c-c3d0da) sm:text-base sm:leading-8"
                  >
                    <span className="mr-2 text-xs font-semibold tabular-nums text-(--c-8195a5)">
                      {String(noteIndex + 1).padStart(2, '0')}.
                    </span>
                    <NoteText note={note} />
                  </p>
                ))}
                {topic.notes.length === 0 && (
                  <p className="text-sm italic leading-7 text-(--c-9aabba)">
                    No explanation notes are available for this topic yet.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </article>

      <nav aria-label="Other weekly notes" className="mt-6 flex items-center justify-between gap-3">
        {week.week > 1 ? (
          <Link
            to={getCoursePath(course.id, `notes/week/${week.week - 1}`)}
            className="inline-flex min-h-11 items-center gap-2 border border-(--c-394c5b) bg-(--c-202f3c) px-4 text-sm font-semibold text-(--c-c3d0da) transition-colors hover:bg-(--c-293d4d)"
          >
            <Icon name="back" className="size-4" />
            Week {week.week - 1}
          </Link>
        ) : <span />}
        {week.week < course.weeks.length && (
          <Link
            to={getCoursePath(course.id, `notes/week/${week.week + 1}`)}
            className="ml-auto inline-flex min-h-11 items-center gap-2 bg-(--c-2d6485) px-4 text-sm font-bold text-white transition-colors hover:bg-(--c-39799d)"
          >
            Week {week.week + 1}
            <Icon name="arrow" className="size-4" />
          </Link>
        )}
      </nav>
    </main>
  )
}
