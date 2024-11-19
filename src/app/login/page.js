// src/app/login/page.js
'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response = await signIn('credentials', {
        username: formData.get('username'),
        password: formData.get('password'),
        redirect: false
      })

      if (response?.error) {
        setError('Kullanıcı adı veya şifre hatalı')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError('Bir hata oluştu')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-lg shadow-xl w-96 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">CRM Giriş</h1>
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 border border-red-700">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-300">Şifre</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  )
}