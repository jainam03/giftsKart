import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CataloguePage from './pages/CataloguePage'
import FestivalGiftsPage from './pages/FestivalGiftsPage'
import CorporateGiftsPage from './pages/CorporateGiftsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import BulkOrderPage from './pages/BulkOrderPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import VendorDashboardPage from './pages/VendorDashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/festival-gifts" element={<FestivalGiftsPage />} />
          <Route path="/corporate-gifts" element={<CorporateGiftsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer routes */}
          <Route path="/bulk-order" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <BulkOrderPage />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <OrderConfirmationPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* Vendor routes */}
          <Route path="/vendor" element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <VendorDashboardPage />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  )
}
