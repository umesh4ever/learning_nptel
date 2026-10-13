import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error stopped this screen.'

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#829087]">Studyroom</p>
      <h1 className="mt-3 text-3xl font-semibold text-[#29465f]">This screen could not load.</h1>
      <p role="alert" className="mt-3 text-sm leading-6 text-[#6e7a72]">{message}</p>
      <a
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#245984] px-5 text-sm font-bold text-white hover:bg-[#1d4b70]"
      >
        Return to Studyroom
      </a>
    </main>
  )
}
