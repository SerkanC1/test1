// src/app/dashboard/users/page.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UserModal from "./UserModal";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  RoleIndicator,
  StatusBadge,
  OnlineStatus,
} from "../../components/ui/StatusIndicator";

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Kullanıcılar getirilemedi");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Kullanıcılar yüklenemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSave = async (userData) => {
    try {
      const url = selectedUser ? `/api/users/${selectedUser.id}` : "/api/users";

      const method = selectedUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("İşlem başarısız");

      fetchUsers(); // Listeyi yenile
      handleCloseModal();
    } catch (error) {
      console.error("Kullanıcı kaydedilemedi:", error);
    }
  };

  // Güvenli tarih formatlama fonksiyonu
  const formatDate = (date, formatStr) => {
    try {
      if (!date) return "-";
      return format(new Date(date), formatStr, { locale: tr });
    } catch (error) {
      console.error("Tarih formatlanırken hata:", error);
      return "-";
    }
  };

  if (!session) return null;
  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="p-4">
        <div className="bg-red-500 text-white p-4 rounded">
          Bu sayfaya erişim yetkiniz yok.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Yeni Kullanıcı
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-gray-300">Yükleniyor...</div>
        ) : (
          <table className="w-full text-gray-300">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Kullanıcı Adı</th>
                <th className="px-4 py-3 text-left">Ad Soyad</th>
                <th className="px-4 py-3 text-center w-20">Rol</th>
                <th className="px-4 py-3 text-left">Kayıt Tarihi</th>
                <th className="px-4 py-3 text-left">Son Giriş</th>
                <th className="px-4 py-3 text-left">Son Çıkış</th>
                <th className="px-4 py-3 text-center w-16">Durum</th>
                <th className="px-4 py-3 text-center w-16">Online</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.namesurname}</td>
                  <td className="px-4 py-3">
                    <RoleIndicator isAdmin={user.role === "ADMIN"} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.createdAt, "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.lastLoginAt, "dd MMM HH:mm")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.lastLogoutAt, "dd MMM HH:mm")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge isActive={user.isActive} />
                  </td>
                  <td className="px-4 py-3">
                    <OnlineStatus isOnline={user.isLogin} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleEdit(user)}
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
