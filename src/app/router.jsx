import { createHashRouter } from 'react-router-dom'
import AppLayout from './AppLayout.jsx'
import RouteError from './routes/RouteError.jsx'

function lazyRoute(loadComponent) {
  return async () => {
    const module = await loadComponent()
    return { Component: module.default }
  }
}

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    hydrateFallbackElement: (
      <main className="grid min-h-screen place-items-center text-sm font-semibold text-[#647f95]">
        Loading Studyroom…
      </main>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, lazy: lazyRoute(() => import('./routes/RouteFallback.jsx')) },
      { path: 'setup/weeks', lazy: lazyRoute(() => import('./routes/WeekSetupRoute.jsx')) },
      { path: 'setup/paper', lazy: lazyRoute(() => import('./routes/PaperSetupRoute.jsx')) },
      { path: 'quiz/:questionNumber', lazy: lazyRoute(() => import('../features/quiz/QuizPage.jsx')) },
      { path: 'results', lazy: lazyRoute(() => import('../features/quiz/ResultsPage.jsx')) },
      { path: '*', lazy: lazyRoute(() => import('./routes/RouteFallback.jsx')) },
    ],
  },
])
