import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Forecasting from './pages/Forecasting';
import Materials from './pages/Materials';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';

import InventoryOptimization from './pages/InventoryOptimization';
import UserDashboard from './pages/UserDashboard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin' ? children : <Navigate to="/app/user-dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="forecasting" element={<Forecasting />} />
          <Route path="inventory" element={<InventoryOptimization />} />
          <Route path="materials" element={<Materials />} />
          <Route path="reports" element={<Reports />} />
          <Route path="suppliers" element={<AdminRoute><Suppliers /></AdminRoute>} />
          <Route path="settings" element={<AdminRoute><Settings /></AdminRoute>} />
          <Route index element={<Navigate to="/app/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
