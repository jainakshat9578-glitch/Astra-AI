import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { handleRegister } = useAuth()
  const error = useSelector((state) => state.auth.error)
  const loading = useSelector((state) => state.auth.loading)
  const navigate = useNavigate()

  const submitForm = async (event) => {
    event.preventDefault()

    const success = await handleRegister({
      username,
      email,
      password,
    })

    setSubmitted(true)
    if (success) {
      navigate('/login')
    }
  }

  return (
    <section className="min-h-screen bg-slate-900 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl shadow-black/50 backdrop-blur">
          <h1 className="text-3xl font-bold text-blue-500">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Register with your username, email, and password.
          </p>
          {submitted && error && (
            <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>
          )}

          <form onSubmit={submitForm} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-200">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
            </div>

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
                placeholder="Create a password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.35)]"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-500 transition hover:text-blue-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Register
