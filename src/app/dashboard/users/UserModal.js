// src/app/dashboard/users/UserModal.js
'use client'

import { useState, useEffect } from 'react'

export default function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: '',
    namesurname: '',
    password: '',
    role: 'USER'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        namesurname: user.namesurname,
        password: '', // Boş bırak, sadece değiştirilirse güncelle
        role: user.role
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username) newErrors.username = 'Kullanıcı adı gerekli'
    if (!formData.namesurname) newErrors.namesurname = 'Ad Soyad gerekli'
    if (!user && !formData.password) newErrors.password = 'Şifre gerekli'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
              {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={formData.namesurname}
                onChange={(e) => setFormData({...formData, namesurname: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
              {errors.namesurname && <p className="text-red-400 text-sm mt-1">{errors.namesurname}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Şifre {user && '(Boş bırakılırsa değişmez)'}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="USER">Kullanıcı</option>
                <option value="ADMIN">Yönetici</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}