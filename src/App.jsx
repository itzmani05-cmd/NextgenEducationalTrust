import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const C3Platform = lazy(() => import('./pages/Scholarships.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Apply = lazy(() => import('./pages/Apply.jsx'))
const StatusCheck = lazy(() => import('./pages/StatusCheck.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Payment = lazy(() => import('./pages/Payment.jsx'))
const Donate = lazy(() => import('./pages/Donate.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Faq = lazy(() => import('./pages/Faq.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics.jsx'))
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications.jsx'))
const AdminApplicationDetail = lazy(() => import('./pages/admin/AdminApplicationDetail.jsx'))
const AdminVerification = lazy(() => import('./pages/admin/AdminVerification.jsx'))
const AdminDonations = lazy(() => import('./pages/admin/AdminDonations.jsx'))
const AdminExpenses = lazy(() => import('./pages/admin/AdminExpenses.jsx'))
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff.jsx'))
const AdminStaffDetail = lazy(() => import('./pages/admin/AdminStaffDetail.jsx'))

const StaffLayout = lazy(() => import('./components/staff/StaffLayout.jsx'))
const StaffLogin = lazy(() => import('./pages/staff/StaffLogin.jsx'))
const StaffChangePassword = lazy(() => import('./pages/staff/StaffChangePassword.jsx'))
const StaffHours = lazy(() => import('./pages/staff/StaffHours.jsx'))
const StaffProfile = lazy(() => import('./pages/staff/StaffProfile.jsx'))
const AdminExamStudents = lazy(() => import('./pages/admin/AdminExamStudents.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'))
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport.jsx'))

import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { StaffAuthProvider } from './context/StaffAuthContext.jsx'

function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-brand-border border-t-brand-rust animate-spin" aria-label="Loading" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes className="px-15">
        <Route element={<AuthProvider><Layout /></AuthProvider>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/platform" element={<C3Platform />} />
          <Route path="/benefits" element={<Navigate to="/platform" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/status" element={<StatusCheck />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
        <Route path="/signup" element={<AuthProvider><SignUp /></AuthProvider>} />

        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <Routes>
                <Route path="login" element={<AdminLogin />} />
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminAnalytics />} />
                  <Route path="exams/:examCategory" element={<AdminExamStudents />} />
                  <Route path="applications" element={<AdminApplications />} />
                  <Route path="applications/:id" element={<AdminApplicationDetail />} />
                  <Route path="verification" element={<AdminVerification />} />
                  <Route path="verification/:id" element={<AdminVerification />} />
                  <Route path="donations" element={<AdminDonations />} />
                  <Route path="expenses" element={<AdminExpenses />} />
                  <Route path="staff" element={<AdminStaff />} />
                  <Route path="staff/:id" element={<AdminStaffDetail />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="support" element={<AdminSupport />} />
                </Route>
              </Routes>
            </AdminAuthProvider>
          }
        />

        <Route
          path="/staff/*"
          element={
            <StaffAuthProvider>
              <Routes>
                <Route path="login" element={<StaffLogin />} />
                <Route path="change-password" element={<StaffChangePassword />} />
                <Route element={<StaffLayout />}>
                  <Route index element={<StaffHours />} />
                  <Route path="profile" element={<StaffProfile />} />
                </Route>
                <Route path="*" element={<Navigate to="/staff" replace />} />
              </Routes>
            </StaffAuthProvider>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default App
