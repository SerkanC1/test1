// src/app/components/ui/LoadingSpinner.js
'use client'

const LoadingSpinner = ({ size = 'default', text = 'Yükleniyor...' }) => {
  // Size varyantları
  const sizeVariants = {
    small: {
      container: 'p-4',
      text: 'text-sm',
      blur: 'blur-sm'
    },
    default: {
      container: 'p-6',
      text: 'text-lg',
      blur: 'blur'
    },
    large: {
      container: 'p-8',
      text: 'text-xl',
      blur: 'blur-lg'
    }
  }

  const variant = sizeVariants[size]

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
      <div className="relative flex items-center justify-center">
        {/* Animasyonlu gradient arka plan */}
        <div className={`
          absolute -inset-0.5 
          rounded-lg 
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
          opacity-75 
          ${variant.blur} 
          animate-pulse
        `} />
        
        {/* İçerik kutusu */}
        <div className={`
          relative 
          rounded-lg 
          bg-gray-800 
          ${variant.container}
          ${variant.text} 
          font-medium 
          text-white
          shadow-xl
        `}>
          {text}
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner