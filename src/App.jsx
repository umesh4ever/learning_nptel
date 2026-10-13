import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.jsx'

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <main className="grid min-h-screen place-items-center text-sm font-semibold text-[#647f95]">
          Loading Studyroom…
        </main>
      }
    />
  )
}
