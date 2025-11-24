import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { ProductPage } from './pages/ProductPage';
import { ProductDetail } from './components/ProductDetail';

function App() {
  return (
      <div className="App">
        <header>
          <h1>Quản lý Sản phẩm (Flogin)</h1>
        </header>

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
                <ProductPage />
            }
          />

          <Route
            path="/products/:id"
            element={
                <ProductDetail />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
  );
}

export default App;