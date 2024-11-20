// src/app/dashboard/page.js
"use client";

import { useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"; // signOut eklendi
import { useRouter } from "next/navigation";
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Sayfa kapatıldığında logout işlemi için useEffect
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (session?.user?.id) {
        await fetch('/api/users/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id })
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [session])

  // Çıkış yap fonksiyonunu güncelle
  const handleSignOut = async () => {
    if (session?.user?.id) {
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      })
    }
    await signOut({ callbackUrl: "/login" })
  }

  // Loading component with animated gradient
  if (status === 'loading') {
    return <LoadingSpinner />
  }

  // Check authentication
  if (!session) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

   return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">CRM Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Hoş geldiniz, {session.user.name}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <p className="text-gray-300">Ana sayfa içeriği buraya gelecek</p>
        </div>
      </div>
    </div>
  );
}