import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.jsx'

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <main className="grid min-h-screen place-items-center bg-(--c-101923) text-sm font-semibold text-(--c-a2b2bf)">
          Loading Studyroom…
        </main>
      }
    />
  )
}
