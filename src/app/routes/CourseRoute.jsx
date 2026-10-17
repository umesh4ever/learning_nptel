import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom'
import { loadCourse, getCourse } from '../../data/courseData.js'
import { useStudyroom } from '../../features/studyroom/StudyroomContext.js'

export default function CourseRoute() {
  const { courseId } = useParams()
  const { state, selectCourse } = useStudyroom()
  const outletContext = useOutletContext()

  // True only if the course was already fully loaded (questions present) at mount time
  const alreadyLoaded = () => {
    const c = getCourse(courseId)
    return Boolean(c?.weeks?.[0]?.questions?.length > 0)
  }
  const [loaded, setLoaded] = useState(alreadyLoaded)
  // Track whether we've synced the full-question state after loading
  const syncedRef = useRef(loaded)

  useEffect(() => {
    if (loaded) return
    let cancelled = false
    loadCourse(courseId).then((course) => {
      if (cancelled || !course) return
      setLoaded(true)
    })
    return () => { cancelled = true }
  }, [courseId, loaded])

  // Once fully loaded, always re-select the course so studyroom state
  // is rebuilt from the full cached data (not catalog stubs with questions:[])
  useEffect(() => {
    if (!loaded || syncedRef.current) return
    syncedRef.current = true
    selectCourse(courseId)
  }, [courseId, loaded, selectCourse])

  if (!getCourse(courseId)) return <Navigate to="/" replace />

  if (!loaded) {
    return (
      <main className="grid min-h-[50vh] place-items-center gap-3 text-sm font-semibold text-(--c-a2b2bf)">
        <svg className="size-6 animate-spin text-(--c-5a91b2)" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Loading course…
      </main>
    )
  }

  if (state.courseId !== courseId) {
    return (
      <main className="grid min-h-[50vh] place-items-center text-sm font-semibold text-(--c-a2b2bf)">
        Loading course…
      </main>
    )
  }

  return <Outlet context={outletContext} />
}
