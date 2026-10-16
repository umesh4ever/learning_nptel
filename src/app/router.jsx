import { createHashRouter, Navigate } from 'react-router-dom'
import AppLayout from './AppLayout.jsx'
import CourseSelectionRedirect from './routes/CourseSelectionRedirect.jsx'
import RouteError from './routes/RouteError.jsx'
import CourseRoute from './routes/CourseRoute.jsx'

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
      <main className="grid min-h-screen place-items-center bg-(--c-101923) text-sm font-semibold text-(--c-a2b2bf)">
        Loading Studyroom…
      </main>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, lazy: lazyRoute(() => import('./routes/CourseSelectionPage.jsx')) },
      { path: 'setup/weeks', element: <CourseSelectionRedirect /> },
      { path: 'setup/paper', element: <CourseSelectionRedirect /> },
      { path: 'quiz/:questionNumber', element: <CourseSelectionRedirect /> },
      { path: 'results', element: <CourseSelectionRedirect /> },
      {
        path: 'courses/:courseId',
        element: <CourseRoute />,
        children: [
          { index: true, element: <Navigate to="setup/weeks" replace /> },
          { path: 'setup/weeks', lazy: lazyRoute(() => import('./routes/WeekSetupRoute.jsx')) },
          { path: 'setup/paper', lazy: lazyRoute(() => import('./routes/PaperSetupRoute.jsx')) },
          { path: 'notes', lazy: lazyRoute(() => import('./routes/CourseNotesPage.jsx')) },
          { path: 'notes/week/:weekNumber', lazy: lazyRoute(() => import('./routes/WeekNotesPage.jsx')) },
          { path: 'quiz/:questionNumber', lazy: lazyRoute(() => import('../features/quiz/QuizPage.jsx')) },
          { path: 'results', lazy: lazyRoute(() => import('../features/quiz/ResultsPage.jsx')) },
        ],
      },
      { path: '*', lazy: lazyRoute(() => import('./routes/RouteFallback.jsx')) },
    ],
  },
])
