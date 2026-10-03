import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'

const App = () => {

  const auth=useAuth()

  useEffect(()=>{
    auth.handleGetMe()
  },[])                // *hydration*
  
  return (
    <RouterProvider router={router} />
  )
}

export default App

