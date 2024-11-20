// src/app/components/layout/Sidebar.js
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Kullanıcılar",
      path: "/dashboard/users",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-gray-800 text-white
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64" : "w-16"} // w-20'den w-16'ya değişti
        flex flex-col
        overflow-hidden
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Alanı */}
      <div className="h-16 border-b border-gray-700 flex items-center">
        <div
          className={`
          flex items-center px-4 gap-3
          transition-all duration-300 ease-in-out
          w-full
        `}
        >
          {/* Logo - her zaman görünür */}
          <Image
            src="/logo_sembol_160x160.png"
            alt="CRM Logo"
            width={32}
            height={32}
            className="flex-shrink-0"
          />

          {/* Yazı - sadece expanded durumunda görünür */}
          <span
            className={`
            font-bold text-xl whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${
              isExpanded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }
          `}
          >
            CRM Sistemi
          </span>
        </div>
      </div>

      {/* Menü Öğeleri */}
      <nav className="flex-1 pt-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`
              flex items-center px-4 py-3 cursor-pointer
              ${pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"}
              transition-colors duration-200
              overflow-hidden // Önemli: İçerik taşmasını engeller
            `}
            onClick={() => router.push(item.path)}
          >
            {/* İkon her zaman görünür */}
            <div className="w-6 h-6 flex-shrink-0">{item.icon}</div>

            {/* Yazı geçiş efekti */}
            <span
              className={`
              ml-4
              whitespace-nowrap
              transition-all duration-300 ease-in-out
              ${
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }
            `}
            >
              {item.title}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}
