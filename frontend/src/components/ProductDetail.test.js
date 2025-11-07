import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProductDetail } from './ProductDetail';
import * as productService from '../services/productService';

// Mock service
jest.mock('../services/productService');
const mockedProductService = productService;
describe('ProductDetail Unit Tests', () => {

  test('Nên hiển thị "Đang tải..." khi không có ID', () => {
    // Render component mà không có :id trên path
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert: Nó hiển thị "Đang tải..." và không gọi API
    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
    expect(mockedProductService.getProductById).not.toHaveBeenCalled();
  });
  
  // (Bạn có thể thêm test happy path và sad path ở đây,
  // nhưng test trên là đủ để cover nhánh line 11)
});