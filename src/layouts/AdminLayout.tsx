import React, { useState, useEffect } from "react"
import { Outlet, NavLink, Link, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import {
  LayoutDashboard,
  Film,
  Clapperboard,
  Ticket,
  Users,
  Percent,
  Bell,
  Building2,
  LogOut,
  Menu,
  X,
  History,
} from "lucide-react"
import { assets } from "../assets/assets"

// --- Komponen Sidebar untuk Navigasi Admin ---
const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }: any) => {
  const location = useLocation()

  const navLinkClass = (path: string, exact = false) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path)
    return `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
      isActive
        ? "bg-primary text-white shadow-lg"
        : "text-gray-400 hover:bg-gray-700 hover:text-white"
    }`
  }

  // Daftar menu admin dengan ikon
  const adminMenus = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} />, exact: true },
    { name: "Manajemen Film", path: "/admin/movies", icon: <Film size={20} /> },
    { name: "Manajemen Genre", path: "/admin/genres", icon: <Clapperboard size={20} /> },
    { name: "Manajemen Jadwal", path: "/admin/schedules", icon: <History size={20} /> },
    { name: "Manajemen Studio", path: "/admin/studios", icon: <Building2 size={20} /> },
    { name: "Manajemen Voucher", path: "/admin/vouchers", icon: <Percent size={20} /> },
    { name: "Daftar Transaksi", path: "/admin/transactions", icon: <Ticket size={20} /> },
    { name: "Manajemen Tiket", path: "/admin/tickets", icon: <Ticket size={20} /> },
    { name: "Manajemen User", path: "/admin/users", icon: <Users size={20} /> },
  ]

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex items-center justify-center border-b border-gray-700 h-16">
        <Link to="/admin">
          <img src={assets.logoSyd} alt="Admin Logo" className="h-8" />
        </Link>
      </div>
      <nav className="p-4 space-y-2">
        {adminMenus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={navLinkClass(menu.path, menu.exact)}
            onClick={() => setIsMobileOpen(false)} // Tutup menu saat link diklik di mobile
            end={menu.exact}
          >
            <span className="mr-3">{menu.icon}</span>
            {menu.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

// --- Komponen Header untuk Konten Admin ---
const AdminHeader = ({ onMenuClick }: any) => {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      {/* Tombol Menu untuk Mobile */}
      <button onClick={onMenuClick} className="md:hidden text-gray-600">
        <Menu size={24} />
      </button>
      {/* Spacer untuk menengahkan judul (opsional) atau mendorong profil ke kanan */}
      <div className="flex-grow"></div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

// --- Komponen Layout Utama untuk Admin ---
const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <AdminHeader onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Overlay untuk mobile saat sidebar terbuka */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default AdminLayout
