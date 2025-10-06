import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "../pages/user/HomePage"
import UserLayout from "../layouts/UserLayout"
import AllMoviesPage from "../pages/user/AllMoviesPage"
import MovieDetailPage from "../pages/user/MovieDetailPage"
import StudioGalleriesPage from "../pages/user/StudioGalleriesPage"
import AboutPage from "../pages/user/AboutPage"
import ContactUs from "../pages/user/ContactUs"
import ProtectedRoute from "./ProtectedRoute"
import MyTicketsPage from "../pages/user/MyTicketsPage"
import MyBookingsHistoryPage from "../pages/user/MyBookingsHistoryPage"
import MyTransactionsHistoryPage from "../pages/user/MyTransactionsHistoryPage"
import MyNotificationsPage from "../pages/user/MyNotificationsPage"
import ProfilePage from "../pages/user/ProfilePage"
import ChangePasswordPage from "../pages/ChangePasswordPage"
import SeatSelectionPage from "../pages/user/SeatSelectionPage"
import BookingSummaryPage from "../pages/user/BookingSummaryPage"
import AdminLayout from "../layouts/AdminLayout"
import DashboardPage from "../pages/admin/DashboardPage"
import ManageMoviesPage from "../pages/admin/ManageMoviesPage"
import ManageGenresPage from "../pages/admin/ManageGenresPage"
import ManageSchedules from "../pages/admin/ManageSchedules"
import ManageStudiosPage from "../pages/admin/ManageStudiosPage"
import ManageTicketsPage from "../pages/admin/ManageTicketsPage"
import ManageUsersPage from "../pages/admin/ManageUsersPage"
import ManageVouchersPage from "../pages/admin/ManageVouchersPage"
import TransactionsListPage from "../pages/admin/TransactionsListPage"
import ManageNotifications from "../pages/admin/ManageNotifications"
import LoginPage from "../pages/LoginPage"
import AdminLoginPage from "../pages/AdminLoginPage"
import RegisterPage from "../pages/RegisterPage"
import VerifyEmailWithTokenPage from "../pages/VerifyEmailWithTokenPage"
import ResetPasswordPage from "../pages/ResetPasswordPage"
import NotFoundPage from "../pages/NotFoundPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import TicketDetailPage from "../pages/admin/TicketDetailPage"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* user routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<AllMoviesPage />} />
          <Route path="movies/:id" element={<MovieDetailPage />} />
          <Route path="studios" element={<StudioGalleriesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactUs />} />

          {/* proptected, user must authenticated */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="schedules/:id/seats" element={<SeatSelectionPage />} />
            <Route path="booking-summary/:transactionId" element={<BookingSummaryPage />} />
            <Route path="my-tickets" element={<MyTicketsPage />} />
            <Route path="my-bookings" element={<MyBookingsHistoryPage />} />
            <Route path="my-transactions-history" element={<MyTransactionsHistoryPage />} />
            <Route path="my-notifications" element={<MyNotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="movies" element={<ManageMoviesPage />} />
            <Route path="genres" element={<ManageGenresPage />} />
            <Route path="schedules" element={<ManageSchedules />} />
            <Route path="studios" element={<ManageStudiosPage />} />
            <Route path="notifications" element={<ManageNotifications />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="vouchers" element={<ManageVouchersPage />} />
            <Route path="transactions" element={<TransactionsListPage />} />
            <Route path="tickets" element={<ManageTicketsPage />} />
            <Route path="tickets/:id" element={<TicketDetailPage/>} />
          </Route>
        </Route>

        {/* route standalone */}
        <Route path="login" element={<LoginPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailWithTokenPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
