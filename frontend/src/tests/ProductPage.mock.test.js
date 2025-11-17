// File: src/tests/ProductPage.mock.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
// SỬA LỖI: Import thêm MemoryRouter
import { MemoryRouter } from "react-router-dom";
import { ProductPage } from "../pages/ProductPage"; // Import component cần test

// Import trực tiếp các hàm từ service
import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";

// 1. Mock toàn bộ module 'productService'
jest.mock("../services/productService");

describe("ProductPage Mock Tests (Req 5.2.1)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  test("Happy Path: Nên tải danh sách và thêm sản phẩm mới (Mocked)", async () => {
    // ---- PHẦN 1: Tải danh sách (Load) ----
    const mockData = [
      { id: 1, name: "Sản phẩm Mock 1", price: 10000, quantity: 10 },
    ];
    
    getAllProducts.mockResolvedValueOnce({
      data: { content: mockData },
    });

    // SỬA LỖI: Bọc component trong MemoryRouter
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    // Chờ cho sản phẩm mock xuất hiện
    expect(await screen.findByText("Sản phẩm Mock 1")).toBeInTheDocument();
    expect(getAllProducts).toHaveBeenCalledTimes(1);

    // ---- PHẦN 2: Thêm sản phẩm (Create) ----
    const newProduct = {
      id: 2, name: "Sản phẩm Mới", price: 20000, quantity: 5, category: "Mocked",
    };
    const updatedData = [...mockData, newProduct];
    
    createProduct.mockResolvedValueOnce({ data: newProduct });
    getAllProducts.mockResolvedValueOnce({
      data: { content: updatedData },
    });
    
    // Điền form
    fireEvent.change(screen.getByTestId("product-name"), { target: { value: "Sản phẩm Mới" } });
    fireEvent.change(screen.getByTestId("product-price"), { target: { value: 20000 } });
    fireEvent.change(screen.getByTestId("product-quantity"), { target: { value: 5 } });
    fireEvent.change(screen.getByTestId("product-category"), { target: { value: "Mocked" } });
    
    // Submit
    fireEvent.click(screen.getByTestId("submit-button"));
    
    // Chờ thông báo thành công
    expect(await screen.findByTestId("success-message")).toHaveTextContent(
      "Thêm sản phẩm thành công!"
    );
    
    // Chờ sản phẩm mới xuất hiện trên UI
    expect(await screen.findByText("Sản phẩm Mới")).toBeInTheDocument();
    
    // Verify mock call
    expect(createProduct).toHaveBeenCalledTimes(1);
    expect(getAllProducts).toHaveBeenCalledTimes(2); 
  });

  test("Sad Path: Nên hiển thị lỗi khi tải danh sách thất bại (Mocked)", async () => {
    getAllProducts.mockRejectedValueOnce(
      new Error("Network Error 500")
    );
    
    // SỬA LỖI: Bọc component trong MemoryRouter
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );
    
    // Chờ thông báo lỗi
    expect(await screen.findByTestId("success-message")).toHaveTextContent(
      "Lỗi khi tải danh sách sản phẩm"
    );
    
    expect(getAllProducts).toHaveBeenCalledTimes(1);
  });

  test("Sad Path: Nên hiển thị lỗi khi thêm sản phẩm thất bại (Mocked)", async () => {
    getAllProducts.mockResolvedValueOnce({
      data: { content: [] },
    });
    
    // SỬA LỖI: Bọc component trong MemoryRouter
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );
    
    createProduct.mockRejectedValueOnce(
      new Error("Lỗi 400 Bad Request")
    );
    
    // Điền form và submit
    fireEvent.change(screen.getByTestId("product-name"), { target: { value: "Sản phẩm Lỗi" } });
    fireEvent.change(screen.getByTestId("product-price"), { target: { value: 123 } });
    fireEvent.change(screen.getByTestId("product-quantity"), { target: { value: 1 } });
    fireEvent.change(screen.getByTestId("product-category"), { target: { value: "Test" } });
    fireEvent.click(screen.getByTestId("submit-button"));

    // Chờ thông báo lỗi
    expect(await screen.findByTestId("success-message")).toHaveTextContent(
      "Lỗi khi thêm sản phẩm"
    );
    
    expect(createProduct).toHaveBeenCalledTimes(1);
    expect(getAllProducts).toHaveBeenCalledTimes(1); 
  });
});