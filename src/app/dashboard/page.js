// src/app/dashboard/page.js
"use client";

import { useSession, signOut } from "next-auth/react"; // signOut eklendi
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Loading component with animated gradient
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur animate-pulse"></div>
          <div className="relative rounded-lg bg-gray-800 px-7 py-4 text-lg font-medium text-white">
            Yükleniyor...
          </div>
        </div>
      </div>
    )
  }

  // Check authentication
  if (!session) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

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