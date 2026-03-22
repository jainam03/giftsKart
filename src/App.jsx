import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CataloguePage from './pages/CataloguePage'
import FestivalGiftsPage from './pages/FestivalGiftsPage'
import CorporateGiftsPage from './pages/CorporateGiftsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import BulkOrderPage from './pages/BulkOrderPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/festival-gifts" element={<FestivalGiftsPage />} />
          <Route path="/corporate-gifts" element={<CorporateGiftsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/bulk-order" element={<BulkOrderPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
