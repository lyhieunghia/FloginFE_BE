import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import App from "../App";
import * as productService from "../services/productService";

// Mock productService
jest.mock("../services/productService");

describe("App Component Integration Tests (Mock)", () => {
  beforeEach(() => {
    // Mock window functions
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    window.scrollTo = jest.fn();
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =================================================================
  // CÁC TEST TÍCH HỢP "HAPPY PATH"
  // =================================================================

  // Test 1: Tải danh sách rỗng
  test("Req 4.2.1(a): Nên tải và hiển thị danh sách (rỗng) từ API", async () => {
    productService.getAllProducts.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Không có sản phẩm nào.")
    ).toBeInTheDocument();
  });

  // Test 2: Create
  test("Req 4.2.1(b) - Create: Nên tạo sản phẩm mới và cập nhật danh sách", async () => {
    const newProduct = {
      id: 1,
      name: "Sản phẩm Test Tích Hợp",
      price: 50000,
      quantity: 20,
      category: "Integration",
    };

    // Mock API calls
    productService.getAllProducts
      .mockResolvedValueOnce({ data: [] }) // Lần 1: danh sách rỗng
      .mockResolvedValueOnce({ data: [newProduct] }); // Lần 2: có sản phẩm mới

    productService.createProduct.mockResolvedValueOnce({ data: newProduct });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Không có sản phẩm nào.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Sản phẩm Test Tích Hợp" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 50000 },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: 20 },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Integration" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await screen.findByText("Thêm sản phẩm thành công!");
    const newProductInList = await screen.findByText("Sản phẩm Test Tích Hợp");
    expect(newProductInList).toBeInTheDocument();
    expect(productService.createProduct).toHaveBeenCalledWith({
      name: "Sản phẩm Test Tích Hợp",
      price: 50000,
      quantity: 20,
      category: "Integration",
      description: "",
    });
  });

  // Test 3: Edit
  test("Req 4.2.1(b) - Edit: Nên cập nhật sản phẩm thành công", async () => {
    const existingProduct = {
      id: 1,
      name: "Sản phẩm Sẽ Được Sửa",
      price: 100,
      quantity: 10,
      category: "Edit",
    };

    const updatedProduct = {
      ...existingProduct,
      price: 999,
    };

    // Mock API calls
    productService.getAllProducts
      .mockResolvedValueOnce({ data: [existingProduct] }) // Lần 1: load danh sách
      .mockResolvedValueOnce({ data: [updatedProduct] }); // Lần 2: sau khi update

    productService.updateProduct.mockResolvedValueOnce({ data: updatedProduct });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm sẽ được sửa/i,
    });
    const editButton = within(productRow).getByTestId(/edit-btn-/);

    // Click nút sửa
    fireEvent.click(editButton);
    
    // Kiểm tra form đã được điền dữ liệu
    expect(await screen.findByTestId("product-name")).toHaveValue("Sản phẩm Sẽ Được Sửa");
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Cập nhật");
    
    // Thay đổi dữ liệu và submit
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 999 },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    // Kiểm tra kết quả cập nhật
    expect(await screen.findByText("Cập nhật sản phẩm thành công!")).toBeInTheDocument();
    
    const updatedRow = await screen.findByRole("row", {
      name: /Sản phẩm sẽ được sửa 999/i,
    });
    expect(updatedRow).toBeInTheDocument();
    
    // Kiểm tra form đã reset về chế độ thêm mới
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Lưu");
    expect(screen.getByTestId("product-name")).toHaveValue("");

    expect(productService.updateProduct).toHaveBeenCalledWith(1, {
      id: 1,
      name: "Sản phẩm Sẽ Được Sửa",
      price: 999,
      quantity: 10,
      category: "Edit",
    });
  });

  // Test 4: Delete
  test("Req 4.2.1(a) - Delete: Nên xóa sản phẩm khỏi danh sách", async () => {
    const productToDelete = {
      id: 1,
      name: "Sản phẩm Sẽ Bị Xóa",
      price: 1,
      quantity: 1,
      category: "Delete",
    };

    // Mock API calls
    productService.getAllProducts
      .mockResolvedValueOnce({ data: [productToDelete] }) // Lần 1: có sản phẩm
      .mockResolvedValueOnce({ data: [] }); // Lần 2: sau khi xóa

    productService.deleteProduct.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm sẽ bị xóa/i,
    });

    const deleteButton = within(productRow).getByTestId(/delete-btn-/);
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Bạn có chắc muốn xóa sản phẩm này?"
    );

    const successMessage = await screen.findByText("Xóa sản phẩm thành công!");
    expect(successMessage).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Sản phẩm Sẽ Bị Xóa")).toBeNull();
    });

    expect(
      await screen.findByText("Không có sản phẩm nào.")
    ).toBeInTheDocument();

    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
  });

  // Test 5: Xem chi tiết
  test("Req 4.2.1(c): Nên hiển thị chi tiết sản phẩm khi click vào link", async () => {
    const product = {
      id: 1,
      name: "Chi tiết Laptop",
      price: 123456,
      quantity: 7,
      category: "Detail",
    };

    // Mock API calls
    productService.getAllProducts.mockResolvedValueOnce({ data: [product] });
    productService.getProductById.mockResolvedValueOnce({ data: product });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productLink = await screen.findByText("Chi tiết Laptop");
    expect(productLink).toBeInTheDocument();

    // Click vào link sản phẩm
    fireEvent.click(productLink);

    // Xác minh trang chi tiết
    const detailName = await screen.findByTestId("product-detail-name");
    expect(detailName).toHaveTextContent("Chi tiết Laptop");
    const detailPrice = await screen.findByTestId("product-detail-price");
    expect(detailPrice).toHaveTextContent(/Giá:\s?123[.,\s]456 VND/);
    const detailQty = await screen.findByTestId("product-detail-quantity");
    expect(detailQty).toHaveTextContent("Số lượng: 7");
    const detailCat = await screen.findByTestId("product-detail-category");
    expect(detailCat).toHaveTextContent("Danh mục: Detail");
    expect(screen.getByText(/Quay về danh sách/)).toBeInTheDocument();

    expect(productService.getProductById).toHaveBeenCalledWith("1");
  });

  // =================================================================
  // CÁC TEST "SAD PATH" ĐỂ TĂNG COVERAGE
  // =================================================================

  // Test 6: Lỗi khi tải danh sách
  test("Sad Path: Nên hiển thị lỗi khi API tải danh sách thất bại", async () => {
    productService.getAllProducts.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText(
      "Lỗi khi tải danh sách sản phẩm"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  // Test 7: Test phân trang
  test("Nên hiển thị sản phẩm từ API trả về cấu trúc phân trang", async () => {
    const paginatedData = {
      content: [
        {
          id: 1,
          name: "Sản phẩm Phân Trang",
          price: 100,
          quantity: 1,
          category: "Test",
        },
      ],
    };

    productService.getAllProducts.mockResolvedValueOnce({ data: paginatedData });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText("Sản phẩm Phân Trang")).toBeInTheDocument();
  });

  // Test 8: Lỗi khi thêm sản phẩm
  test("Sad Path: Nên hiển thị lỗi khi thêm sản phẩm thất bại", async () => {
    productService.getAllProducts.mockResolvedValueOnce({ data: [] });
    productService.createProduct.mockRejectedValueOnce(new Error("Create Error"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    await screen.findByText("Không có sản phẩm nào.");

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Sản phẩm Bị Lỗi" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 100 },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: 10 },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Error" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    const errorMessage = await screen.findByText("Lỗi khi thêm sản phẩm");
    expect(errorMessage).toBeInTheDocument();
  });

  // Test 9: Lỗi khi cập nhật sản phẩm
  test("Sad Path: Nên hiển thị lỗi khi cập nhật sản phẩm thất bại", async () => {
    const existingProduct = {
      id: 1,
      name: "Sản phẩm Update Lỗi",
      price: 100,
      quantity: 10,
      category: "Edit",
    };

    productService.getAllProducts.mockResolvedValueOnce({ data: [existingProduct] });
    productService.updateProduct.mockRejectedValueOnce(new Error("Update Error"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm update lỗi/i,
    });
    const editButton = within(productRow).getByTestId(/edit-btn-/);

    fireEvent.click(editButton);
    
    await screen.findByTestId("product-name");
    
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 999 },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    const errorMessage = await screen.findByText("Lỗi khi cập nhật sản phẩm");
    expect(errorMessage).toBeInTheDocument();
  });

  // Test 10: Lỗi khi xóa sản phẩm
  test("Sad Path: Nên hiển thị lỗi khi xóa sản phẩm thất bại", async () => {
    const mockProduct = {
      id: 99,
      name: "Sản phẩm Xóa Lỗi",
      price: 1,
      quantity: 1,
      category: "Delete",
    };

    productService.getAllProducts.mockResolvedValueOnce({ data: [mockProduct] });
    productService.deleteProduct.mockRejectedValueOnce(new Error("Delete Error"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm xóa lỗi/i,
    });

    const deleteButton = within(productRow).getByTestId(/delete-btn-99/);
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();

    const errorMessage = await screen.findByText("Lỗi khi xóa sản phẩm");
    expect(errorMessage).toBeInTheDocument();
  });

  // Test 11: Lỗi khi xem chi tiết
  test("Sad Path: Nên hiển thị lỗi khi xem chi tiết sản phẩm không tồn tại", async () => {
    const mockProduct = {
      id: 101,
      name: "Sản phẩm xem chi tiết",
      price: 1,
      quantity: 1,
      category: "Detail",
    };

    productService.getAllProducts.mockResolvedValueOnce({ data: [mockProduct] });
    productService.getProductById.mockRejectedValueOnce(new Error("Not Found"));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productLink = await screen.findByText("Sản phẩm xem chi tiết");
    fireEvent.click(productLink);

    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toHaveTextContent("Không tìm thấy sản phẩm");
  });

  // Test 12: Không xóa khi nhấn Cancel
  test("Sad Path: Không nên xóa sản phẩm nếu người dùng nhấn 'Cancel'", async () => {
    const product = {
      id: 1,
      name: "Sản phẩm không xóa",
      price: 1,
      quantity: 1,
      category: "Test",
    };

    window.confirm.mockReturnValueOnce(false);

    productService.getAllProducts.mockResolvedValueOnce({ data: [product] });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm không xóa/i,
    });
    const deleteButton = within(productRow).getByTestId(/delete-btn-/);
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(productService.deleteProduct).not.toHaveBeenCalled();
    expect(screen.queryByText("Xóa sản phẩm thành công!")).toBeNull();
    expect(await screen.findByText("Sản phẩm không xóa")).toBeInTheDocument();
  });

  // Test 13: Xử lý cấu trúc dữ liệu không hợp lệ
  test("Sad Path: Nên xử lý khi API trả về cấu trúc dữ liệu không hợp lệ", async () => {
    productService.getAllProducts.mockResolvedValueOnce({ 
      data: { message: "API trả về lỗi cấu trúc" } 
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Không có sản phẩm nào.")
    ).toBeInTheDocument();
  });

  // Test 14: Test nút Hủy sửa
  test("Nên reset form khi nhấn nút Hủy sửa", async () => {
    const existingProduct = {
      id: 1,
      name: "Sản phẩm Test Hủy",
      price: 100,
      quantity: 10,
      category: "Edit",
    };

    productService.getAllProducts.mockResolvedValueOnce({ data: [existingProduct] });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm test hủy/i,
    });
    const editButton = within(productRow).getByTestId(/edit-btn-/);

    fireEvent.click(editButton);
    
    expect(await screen.findByTestId("product-name")).toHaveValue("Sản phẩm Test Hủy");
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Cập nhật");
    
    // Click nút Hủy sửa
    const cancelButton = screen.getByText("← Hủy Sửa");
    fireEvent.click(cancelButton);

    expect(screen.getByTestId("submit-button")).toHaveTextContent("Lưu");
    expect(screen.getByTestId("product-name")).toHaveValue("");
  });
});
