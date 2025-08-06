import { useState, useEffect, useRef } from "react"
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import VerifyEmailBanner from "../components/VerifyEmailBanner"
import { assets } from "../assets/assets"
import { Bell, MenuIcon, SearchIcon, XIcon } from "lucide-react"
import { getMyNotifications } from "../api/apiService"

const UserProfileDropdown = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Menutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
      >
        <img
          src={
            user?.profile_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`
          }
          alt="Profil"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden md:block">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 text-gray-800">
          <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Profil Saya
          </Link>
          <Link to="/my-tickets" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Tiket Saya
          </Link>
          <Link to="/my-bookings" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Riwayat Booking
          </Link>
          <Link to="/my-transactions-history" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Riwayat Transaksi
          </Link>
          <Link to="/change-password" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Ubah Password
          </Link>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={logout}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

const Navbar = () => {
  const { user } = useAuth()

  const navigate = useNavigate()

  const [unreadCount, setUnreadCount] = useState(0)

  // Efek ini akan berjalan saat user login atau logout
  useEffect(() => {
    // Jika user ada (login berhasil atau sesi aktif), ambil notifikasi
    if (user) {
      getMyNotifications()
        .then((notifications) => {
          const count = notifications.filter((n: any) => !n.is_read).length
          setUnreadCount(count)
        })
        .catch((err) => {
          console.error("Gagal mengambil notifikasi di Navbar:", err)
          setUnreadCount(0)
        })
    } else {
      // Jika user null (logout atau sesi tidak ada), reset hitungan
      setUnreadCount(0)
    }
  }, [user])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium ${
      isActive ? "text-primary hover:text-primary-duil" : "text-gray-300 hover:text-white"
    }`
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <NavLink
          onClick={() => {
            scrollTo(0, 0)
            setIsOpen(false)
          }}
          to="/"
          className={navLinkClass}
        >
          Home
        </NavLink>
        <NavLink
          onClick={() => {
            scrollTo(0, 0)
            setIsOpen(false)
          }}
          to="/movies"
          className={navLinkClass}
        >
          Film
        </NavLink>
        <NavLink
          onClick={() => {
            scrollTo(0, 0)
            setIsOpen(false)
          }}
          to="/studios"
          className={navLinkClass}
        >
          Studio
        </NavLink>
        <NavLink
          onClick={() => {
            scrollTo(0, 0)
            setIsOpen(false)
          }}
          to="/about"
          className={navLinkClass}
        >
          About
        </NavLink>
        <NavLink
          onClick={() => {
            scrollTo(0, 0)
            setIsOpen(false)
          }}
          to="/contact"
          className={navLinkClass}
        >
          Contact
        </NavLink>
      </div>
      <div className="flex items-center gap-8">
        {user ? (
          <>
            <Link
              to="/my-notifications"
              className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
            >
              <Bell className="w-6 h-6 cursor-pointer" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center ring-2 ring-gray-800">
                  {unreadCount}
                </span>
              )}
            </Link>
            <UserProfileDropdown />
          </>
        ) : (
          <button
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-duil transition rounded-full font-medium cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

        <SearchIcon className="w-6 h-6 cursor-pointer" onClick={() => navigate("/movies")} />
      </div>
      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

const Footer = () => {
  return (
    <footer className="px-6 pt-8 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <img alt="" className="h-11" src={assets.logo} />
          <p className="mt-6 text-sm">
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>contact@example.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © <a href="#">Surya Yudha Cinema</a>. All Right
        Reserved.
      </p>
    </footer>
  )
}

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default UserLayout
