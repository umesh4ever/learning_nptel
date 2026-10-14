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
      <p className="text-xs font-bold uppercase tracking-[0.19em] text-(--c-91a4b3)">Studyroom</p>
      <h1 className="mt-3 text-3xl font-semibold text-(--c-dce7ef)">This screen could not load.</h1>
      <p role="alert" className="mt-3 text-sm leading-6 text-(--c-a2b2bf)">{message}</p>
      <a
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-(--c-2d6485) px-5 text-sm font-bold text-white hover:bg-(--c-39799d)"
      >
        Return to Studyroom
      </a>
    </main>
  )
}
