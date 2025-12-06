import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock các component con để tránh dependencies
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

describe('App', () => {
  test('redirect "/" tới "/login"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('render LoginPage tại route "/login"', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('render ProductPage tại route "/products"', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('product-page')).toBeInTheDocument();
  });

  test('render App với class "App"', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(container.querySelector('.App')).toBeInTheDocument();
  });
});
