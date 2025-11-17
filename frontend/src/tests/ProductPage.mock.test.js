// File: src/tests/ProductPage.mock.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within, // THÊM within để tìm nút trong row
} from "@testing-library/react";
import "@testing-library/jest-dom";
// SỬA LỖI: Import thêm MemoryRouter
import { MemoryRouter } from "react-router-dom";
import { ProductPage } from "../pages/ProductPage"; // Import component cần test

// Import trực tiếp các hàm từ service
import {
  getAllProducts,
  createProduct,
  // BỔ SUNG updateProduct
  updateProduct,
  deleteProduct,
} from "../services/productService"; // Cần import updateProduct

// 1. Mock toàn bộ module 'productService'
jest.mock("../services/productService");

describe("ProductPage Mock Tests (Req 5.2.1)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Giả lập window.confirm luôn trả về true (Đồng ý xóa)
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
    getAllProducts.mockResolvedValueOnce({ // Mock lần gọi API thứ 2 (refresh list)
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

  // --- BỔ SUNG: Test luồng XÓA (DELETE) ---
  test("Happy Path: Nên xóa sản phẩm thành công (Mocked)", async () => {
    const mockData = [
      { id: 99, name: "Sản phẩm Sẽ Xóa", price: 100, quantity: 10, category: "Del" },
    ];

    getAllProducts.mockResolvedValueOnce({ data: { content: mockData } });
    deleteProduct.mockResolvedValueOnce({}); // Mock: Xóa thành công
    
    // Mock: Lần gọi API thứ 2 (refresh list) trả về rỗng
    getAllProducts.mockResolvedValueOnce({ data: { content: [] } }); 
    
    render(<MemoryRouter><ProductPage /></MemoryRouter>);

    // 1. Tìm row và nút xóa
    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm Sẽ Xóa/i,
    });
    const deleteButton = within(productRow).getByTestId(/delete-btn-99/);
    
    // 2. Click nút xóa
    fireEvent.click(deleteButton);

    // 3. Chờ thông báo thành công
    expect(await screen.findByTestId("success-message")).toHaveTextContent(
      "Xóa sản phẩm thành công!"
    );
    
    // 4. Xác minh mock call và danh sách rỗng
    expect(deleteProduct).toHaveBeenCalledWith(99);
    expect(deleteProduct).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Không có sản phẩm nào.")).toBeInTheDocument();
  });

  // --- BỔ SUNG: Test luồng SỬA (UPDATE) ---
  test("Happy Path: Nên sửa sản phẩm và cập nhật danh sách (Mocked)", async () => {
    const initialProduct = { id: 5, name: "Laptop Cũ", price: 1000, quantity: 1, category: "Old" };
    const updatedProduct = { id: 5, name: "Laptop Mới", price: 1500, quantity: 2, category: "New" };
    
    getAllProducts.mockResolvedValueOnce({ data: { content: [initialProduct] } });
    updateProduct.mockResolvedValueOnce({ data: updatedProduct });
    
    // Mock: Lần gọi API thứ 2 (refresh list) trả về sản phẩm đã sửa
    getAllProducts.mockResolvedValueOnce({ data: { content: [updatedProduct] } });
    
    render(<MemoryRouter><ProductPage /></MemoryRouter>);

    // 1. Tìm row và nút sửa
    const productRow = await screen.findByRole("row", { name: /Laptop Cũ/i });
    const editButton = within(productRow).getByTestId(/edit-btn-5/);

    // 2. Click nút sửa
    fireEvent.click(editButton);

    // 3. Form hiển thị chế độ Sửa và điền dữ liệu cũ
    expect(screen.getByText("Sửa Sản Phẩm")).toBeInTheDocument();
    expect(screen.getByTestId("product-name")).toHaveValue("Laptop Cũ");
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Cập nhật");

    // 4. Sửa dữ liệu
    fireEvent.change(screen.getByTestId("product-name"), { target: { value: "Laptop Mới" } });
    fireEvent.change(screen.getByTestId("product-price"), { target: { value: 1500 } });

    // 5. Submit
    fireEvent.click(screen.getByTestId("submit-button"));

    // 6. Chờ thông báo thành công
    expect(await screen.findByTestId("success-message")).toHaveTextContent(
      "Cập nhật sản phẩm thành công!"
    );
    
    // 7. Xác minh mock call và danh sách cập nhật
    expect(updateProduct).toHaveBeenCalledTimes(1);
    expect(updateProduct).toHaveBeenCalledWith(5, expect.objectContaining({ name: "Laptop Mới" }));
    expect(await screen.findByText("Laptop Mới")).toBeInTheDocument();
  });

  // --- SAD PATHS CŨ (Giữ nguyên) ---

  test("Sad Path: Nên hiển thị lỗi khi tải danh sách thất bại (Mocked)", async () => {
    getAllProducts.mockRejectedValueOnce(
      new Error("Network Error 500")
    );
    
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