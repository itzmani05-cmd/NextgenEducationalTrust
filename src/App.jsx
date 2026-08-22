import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import C3Platform from './pages/Scholarships.jsx'
import Events from './pages/Events.jsx'
import Apply from './pages/Apply.jsx'
import StatusCheck from './pages/StatusCheck.jsx'
import Profile from './pages/Profile.jsx'
import Payment from './pages/Payment.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Contact from './pages/Contact.jsx'
import Faq from './pages/Faq.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'

import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx'
import AdminApplications from './pages/admin/AdminApplications.jsx'
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail.jsx'
import AdminVerification from './pages/admin/AdminVerification.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminSupport from './pages/admin/AdminSupport.jsx'

function App() {
  return (
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
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
                <Route path="applications" element={<AdminApplications />} />
                <Route path="applications/:id" element={<AdminApplicationDetail />} />
                <Route path="verification" element={<AdminVerification />} />
                <Route path="verification/:id" element={<AdminVerification />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="support" element={<AdminSupport />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        }
      />
    </Routes>
  )
}

export default App
