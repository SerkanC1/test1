// src/app/dashboard/layout.js
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 ml-16">{children}</main>
    </div>
  );
}
