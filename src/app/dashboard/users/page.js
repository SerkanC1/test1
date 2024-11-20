// src/app/dashboard/users/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Kullanıcılar getirilemedi");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Kullanıcılar yüklenemedi:", error);
      setError("Kullanıcılar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Silme işlemi başarısız");
      }

      await fetchUsers(); // Listeyi güncelle
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      handleDelete(userToDelete.id);
    }
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleModalSave = async () => {
    await fetchUsers(); // Liste güncelleme
    handleModalClose(); // Modal kapatma
  };

  const formatDate = (date, formatStr = "dd/MM/yyyy HH:mm:ss") => {
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
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}
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
                <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.namesurname}</td>
                  <td className="px-4 py-3 text-center">
                    <RoleIndicator isAdmin={user.role === 'ADMIN'} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.createdAt, "dd/MM/yyyy HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.lastLoginAt, "dd/MM/yyyy HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.lastLogoutAt, "dd/MM/yyyy HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge isActive={user.isActive} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <OnlineStatus isOnline={user.isLogin} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                      onClick={() => handleEdit(user)}
                    >
                      Düzenle
                    </button>
                    {user.role !== 'ADMIN' && (
                      <button 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 ml-2"
                        onClick={() => confirmDelete(user)}
                      >
                        Sil
                      </button>
                    )}
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
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Kullanıcıyı Sil</h2>
            <p className="text-gray-300 mb-4">
              {userToDelete?.username} adlı kullanıcıyı silmek istediğinize emin misiniz?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Hayır
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Evet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}