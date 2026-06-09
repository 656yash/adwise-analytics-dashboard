import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardOverview from './pages/DashboardOverview';
import RevenueAnalytics from './pages/RevenueAnalytics';
import MarketingAnalytics from './pages/MarketingAnalytics';
import CustomerAnalytics from './pages/CustomerAnalytics';
import ProductAnalytics from './pages/ProductAnalytics';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<DashboardOverview />} />
          <Route path="revenue" element={<RevenueAnalytics />} />
          <Route path="marketing" element={<MarketingAnalytics />} />
          <Route path="customers" element={<CustomerAnalytics />} />
          <Route path="products" element={<ProductAnalytics />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
