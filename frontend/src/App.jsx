import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { ProductPage } from './pages/ProductPage';
import { ProductDetail } from './components/ProductDetail';
import { AuthProvider, ProtectedRoute } from './auth';

/**
 * Main App Component với Secure Authentication
 * 
 * Security improvements:
 * - AuthProvider wrap toàn bộ app
 * - ProtectedRoute cho các route cần authentication
 * - Không có redirect logic trong App (để ProtectedRoute handle)
 * - Clean separation of concerns
 */
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header>
          <h1>Quản lý Sản phẩm (Flogin)</h1>
        </header>

        <Routes>
          {/* Public route - Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />

          {/* Fallback - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
