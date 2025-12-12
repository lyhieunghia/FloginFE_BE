import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock AuthProvider to bypass authentication
jest.mock('../auth/AuthProvider', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock các component con
jest.mock('../pages/LoginPage', () => {
  return function MockLoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('../pages/ProductPage', () => {
  return {
    ProductPage: function MockProductPage() {
      return <div data-testid="product-page">Product Page</div>;
    }
  };
});

jest.mock('../components/ProductDetail', () => {
  return {
    ProductDetail: function MockProductDetail() {
      return <div data-testid="product-detail">Product Detail</div>;
    }
  };
});

describe('App', () => {
  const renderApp = (initialRoute = '/') => {
    window.history.pushState({}, 'Test page', initialRoute);
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  test('render header với title "Quản lý Sản phẩm (Flogin)"', () => {
    renderApp();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Quản lý Sản phẩm (Flogin)');
  });

  test('render ProductPage tại route "/"', () => {
    renderApp('/');

    expect(screen.getByTestId('product-page')).toBeInTheDocument();
  });

  test('render LoginPage tại route "/login"', () => {
    renderApp('/login');

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('render ProductDetail tại route "/products/:id"', () => {
    renderApp('/products/123');

    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  });

  test('redirect về "/" khi route không tồn tại', () => {
    renderApp('/invalid-route');

    // Sau khi redirect, sẽ hiển thị ProductPage
    expect(screen.getByTestId('product-page')).toBeInTheDocument();
  });

  test('render App với class "App"', () => {
    const { container } = renderApp();

    expect(container.querySelector('.App')).toBeInTheDocument();
  });

  test('render header tag', () => {
    const { container } = renderApp();

    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
