// src/app/components/ui/StatusIndicator.js
export function RoleIndicator({ isAdmin }) {
    return (
        <div className="flex justify-center">
          <div className={`
            flex items-center gap-1.5
            px-2.5 py-1 rounded-full
            ${isAdmin 
              ? 'bg-blue-500/10 text-blue-500' 
              : 'bg-gray-500/10 text-gray-500'
            }
            text-xs font-medium
          `} title={isAdmin ? 'Yönetici' : 'Kullanıcı'}>
            <span className={`
              w-1.5 h-1.5 rounded-full
              ${isAdmin ? 'bg-blue-500' : 'bg-gray-500'}
            `} />
            {isAdmin ? 'Admin' : 'User'}
          </div>
        </div>
      )
  }
  
  export function StatusBadge({ isActive }) {
    return (
      <div className="flex justify-center">
        <div className={`
          flex items-center gap-1.5 
          px-2.5 py-1 rounded-full 
          ${isActive 
            ? 'bg-green-500/10 text-green-500' 
            : 'bg-red-500/10 text-red-500'
          }
          text-xs font-medium
        `} title={isActive ? 'Aktif' : 'Pasif'}>
          <span className={`
            w-1.5 h-1.5 rounded-full 
            ${isActive ? 'bg-green-500' : 'bg-red-500'}
          `} />
          {isActive ? 'Aktif' : 'Pasif'}
        </div>
      </div>
    )
  }
  
  export function OnlineStatus({ isOnline }) {
    return (
      <div className="flex justify-center">
        <div className={`
          flex items-center gap-1.5
          px-2.5 py-1 rounded-full
          ${isOnline 
            ? 'bg-emerald-500/10 text-emerald-500' 
            : 'bg-gray-500/10 text-gray-500'
          }
          text-xs font-medium
        `} title={isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}>
          <span className={`
            w-1.5 h-1.5 rounded-full
            ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}
          `} />
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
    )
  }