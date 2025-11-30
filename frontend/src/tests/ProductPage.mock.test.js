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
    // SỬA: Bổ sung category cho sản phẩm mock
    const mockData = [
      { id: 1, name: "Sản phẩm Mock 1", price: 10000, quantity: 10, category: "Mocked" },
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

  test("Coverage: Nên hiển thị lỗi khi CẬP NHẬT sản phẩm thất bại (Update Sad Path)", async () => {
    // SỬA LỖI 1: Bổ sung 'category' cho sản phẩm mock để qua validation
    getAllProducts.mockResolvedValueOnce({ data: { content: [{ id: 10, name: 'Sản phẩm lỗi', price: 1, quantity: 1, category: 'Temp' }] } });
    
    // Mock Update thất bại
    updateProduct.mockRejectedValueOnce(new Error("Update Failed"));
    
    render(<MemoryRouter><ProductPage /></MemoryRouter>);
    
    const editButton = await screen.findByTestId("edit-btn-10");
    fireEvent.click(editButton);

    // Sửa và submit
    fireEvent.change(screen.getByTestId("product-name"), { target: { value: "Sản phẩm lỗi mới" } });
    fireEvent.click(screen.getByText("Cập nhật"));

    // SỬA LỖI 2: Thêm await waitFor để đảm bảo chờ state update từ promise rejection
    await waitFor(() => {
        expect(screen.getByTestId("success-message")).toHaveTextContent("Lỗi khi cập nhật sản phẩm");
    });
    expect(updateProduct).toHaveBeenCalledTimes(1);
  });

  test("Coverage: Nên hủy việc xóa khi người dùng nhấn 'Cancel' (Delete Confirm Branch)", async () => {
    // SỬA: Bổ sung 'category'
    getAllProducts.mockResolvedValueOnce({ data: { content: [{ id: 11, name: 'Sản phẩm Hủy', price: 1, quantity: 1, category: 'Test' }] } });
    
    // Giả lập người dùng nhấn CANCEL
    window.confirm.mockReturnValueOnce(false); 
    
    render(<MemoryRouter><ProductPage /></MemoryRouter>);

    const productRow = await screen.findByRole("row", { name: /Sản phẩm Hủy/i });
    const deleteButton = within(productRow).getByTestId(/delete-btn-11/);
    
    fireEvent.click(deleteButton);

    // Xác minh deleteProduct KHÔNG được gọi
    expect(deleteProduct).not.toHaveBeenCalled();
    // Xác minh sản phẩm vẫn còn trên list
    expect(screen.getByText("Sản phẩm Hủy")).toBeInTheDocument();
  });

  test("Coverage: Nên reset form nếu sản phẩm đang SỬA bị XÓA khỏi danh sách (Editing Reset Branch)", async () => {
    // SỬA: Bổ sung 'category'
    const productToEdit = { id: 12, name: 'Sản phẩm Đang Sửa', price: 1, quantity: 1, category: 'Test' };
    
    // 1. Mock List (có sản phẩm)
    getAllProducts.mockResolvedValueOnce({ data: { content: [productToEdit] } });
    
    // 2. Mock Delete thành công
    deleteProduct.mockResolvedValueOnce({});
    
    // 3. Mock List (lần refresh)
    getAllProducts.mockResolvedValueOnce({ data: { content: [] } }); 
    
    render(<MemoryRouter><ProductPage /></MemoryRouter>);

    // A. KÍCH HOẠT CHẾ ĐỘ SỬA
    fireEvent.click(await screen.findByTestId("edit-btn-12"));
    expect(screen.getByText("Sửa Sản Phẩm")).toBeInTheDocument(); // Form là chế độ sửa
    
    // B. KÍCH HOẠT CHỨC NĂNG XÓA (cho chính sản phẩm đang sửa)
    const productRow = await screen.findByRole("row", { name: /Sản phẩm Đang Sửa/i });
    const deleteButton = within(productRow).getByTestId(/delete-btn-12/);
    fireEvent.click(deleteButton);

    // Chờ refresh
    await waitFor(() => {
        // C. KIỂM TRA FORM ĐÃ RESET
        expect(screen.getByText("Thêm Sản Phẩm")).toBeInTheDocument(); // Form reset về chế độ Thêm
        expect(screen.getByTestId("product-name")).toHaveValue(""); // Input rỗng
    });
    
    // Kịch bản này sẽ cover các nhánh còn lại trong ProductPage.js
  });

  test("Coverage: Nên hủy chế độ SỬA khi nhấn nút 'Hủy Sửa'", async () => {
    // SỬA: Bổ sung 'category'
    const initialProduct = { id: 100, name: "SP Hủy", price: 1, quantity: 1, category: 'Test' };
    
    // Mock List (để sản phẩm xuất hiện)
    getAllProducts.mockResolvedValueOnce({ data: { content: [initialProduct] } });
    
    render(<MemoryRouter><ProductPage /></MemoryRouter>);

    // A. KÍCH HOẠT CHẾ ĐỘ SỬA
    const editButton = await screen.findByTestId("edit-btn-100");
    fireEvent.click(editButton);
    
    // Xác minh form đã vào chế độ Sửa
    expect(screen.getByText("Sửa Sản Phẩm")).toBeInTheDocument(); 

    // B. NHẤN NÚT HỦY SỬA (Nút này xuất hiện khi editingProduct có giá trị)
    // SỬA LỖI 3: Dùng regex để khớp với nội dung có chứa ký tự đặc biệt (&larr; Hủy Sửa)
    const cancelButton = screen.getByText(/Hủy Sửa/i);
    fireEvent.click(cancelButton); 

    // C. KIỂM TRA RESET VỀ CHẾ ĐỘ THÊM MỚI
    expect(screen.getByText("Thêm Sản Phẩm")).toBeInTheDocument(); // Quay về Thêm Sản Phẩm
    expect(screen.getByTestId("product-name")).toHaveValue(""); // Input rỗng
    
    // Test này sẽ kích hoạt và cover Lines 97-98
  });

  
});