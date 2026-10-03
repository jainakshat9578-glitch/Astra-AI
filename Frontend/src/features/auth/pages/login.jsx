import React, { useState } from 'react'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user=useSelector(state=>state.auth.user)
  const loading=useSelector(state=>state.auth.loading)
  const error=useSelector(state=>state.auth.error)

  const {handleLogin}=useAuth()

  const navigate=useNavigate()

  const submitForm = async (event) => {
    event.preventDefault()

    const payload = {
      email,
      password,
    }
    const success = await handleLogin(payload)
    if (success) {
      navigate("/")
    }

  }

  if(!loading && user){
    return <Navigate to="/" replace />
  }

  return (
    <section className="min-h-screen bg-slate-900 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl shadow-black/50 backdrop-blur">
          <h1 className="text-3xl font-bold text-blue-500">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Login with your email and password.
          </p>
          {error && (
            <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>
          )}

          <form onSubmit={submitForm} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.35)]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-500 transition hover:text-blue-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login
