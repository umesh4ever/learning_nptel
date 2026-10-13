import { createContext, useContext } from 'react'

export const StudyroomContext = createContext(null)

export function useStudyroom() {
  const context = useContext(StudyroomContext)
  if (!context) throw new Error('useStudyroom must be used within StudyroomProvider.')
  return context
}
