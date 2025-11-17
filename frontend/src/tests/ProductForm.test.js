import React from "react";
import { render, screen, fireEvent, waitFor, rerender } from "@testing-library/react"; 
import "@testing-library/jest-dom";
import { ProductForm } from "../components/ProductForm";
import * as Validation from "../utils/productValidation";

// Mock hàm validateProduct
const mockValidateProduct = jest.spyOn(Validation, "validateProduct");

describe("ProductForm Component Unit Test", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockValidateProduct.mockClear();
    mockOnSubmit.mockClear();
  });

  // --- TEST CASE CŨ (Giữ nguyên) ---

  test("Hiển thị lỗi validation khi submit form với dữ liệu không hợp lệ", async () => {
    // Giả lập hàm validate trả về lỗi
    mockValidateProduct.mockReturnValue({
      name: "Tên sản phẩm không được để trống",
      price: "Giá sản phẩm phải lớn hơn 0",
      category: "Danh mục không được để trống",
      quantity: "Số lượng không hợp lệ",
    });

    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Action: Click nút submit
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    // Assert:
    expect(mockValidateProduct).toHaveBeenCalledTimes(1);

    // Các thông báo lỗi được hiển thị
    expect(await screen.findByTestId("error-name")).toHaveTextContent(
      "Tên sản phẩm không được để trống"
    );
    expect(await screen.findByTestId("error-price")).toHaveTextContent(
      "Giá sản phẩm phải lớn hơn 0"
    );
    expect(await screen.findByTestId("error-category")).toHaveTextContent(
      "Danh mục không được để trống"
    );
    expect(await screen.findByTestId("error-quantity")).toHaveTextContent(
      "Số lượng không hợp lệ"
    );

    // Hàm onSubmit không được gọi
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("Gọi hàm onSubmit khi dữ liệu hợp lệ", async () => {
    // Giả lập hàm validate không trả về lỗi
    mockValidateProduct.mockReturnValue({});

    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Action: Nhập dữ liệu (giả lập là hợp lệ)
    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Laptop" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "20000" }, // Input giá trị chuỗi
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "10" }, // Input giá trị chuỗi
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Tech" },
    });

    // Click submit
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    // Assert:
    expect(mockValidateProduct).toHaveBeenCalledTimes(1);

    // Hàm onSubmit được gọi 1 lần
    await waitFor(() => {
      // 🟢 SỬA LỖI TẠI ĐÂY: Mong đợi giá trị là SỐ sau khi chuyển đổi trong handleSubmit
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Laptop",
          price: 20000, // Mong đợi số
          quantity: 10,  // Mong đợi số
          category: "Tech",
        })
      );
    });
  });

  // --- TEST CASE MỚI CHO CHỨC NĂNG SỬA (UPDATE) ---

  test("Nên hiển thị dữ liệu sản phẩm và đổi nút thành 'Cập nhật' khi ở chế độ Sửa", () => {
    const mockProduct = {
      id: 5,
      name: "Smartphone X",
      price: 10000000,
      quantity: 50,
      description: "Mô tả cũ",
      category: "Mobile",
    };

    // 1. Render component với prop productToEdit
    const { rerender } = render(
      <ProductForm onSubmit={mockOnSubmit} productToEdit={mockProduct} />
    );

    // Assert 1: Kiểm tra các input đã được điền đúng dữ liệu (chế độ Sửa)
    expect(screen.getByTestId("product-name")).toHaveValue("Smartphone X");
    expect(screen.getByTestId("product-price")).toHaveValue(10000000); // Input type="number" tự chuyển về số
    expect(screen.getByTestId("product-quantity")).toHaveValue(50);
    expect(screen.getByTestId("product-category")).toHaveValue("Mobile");
    
    // Assert 2: Kiểm tra nút submit hiển thị "Cập nhật"
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Cập nhật");

    // Assert 3: Kiểm tra form reset khi productToEdit chuyển về null (kết thúc sửa)
    rerender(<ProductForm onSubmit={mockOnSubmit} productToEdit={null} />);
    
    // Nút submit phải trở lại "Lưu"
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Lưu");
    // Form phải rỗng
    expect(screen.getByTestId("product-name")).toHaveValue("");
  });
  
  test("Gọi hàm onSubmit khi SỬA dữ liệu hợp lệ", async () => {
    mockValidateProduct.mockReturnValue({}); // Giả lập hợp lệ

    const mockProduct = {
      id: 5,
      name: "Old Name",
      price: 10,
      quantity: 1,
      category: "Test",
    };

    render(
      <ProductForm onSubmit={mockOnSubmit} productToEdit={mockProduct} />
    );
    
    // Action: Thay đổi một trường
    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "New Name" },
    });

    // Click submit (Nút phải là Cập nhật)
    fireEvent.click(screen.getByText("Cập nhật"));

    // Assert:
    expect(mockValidateProduct).toHaveBeenCalledTimes(1);

    // Kiểm tra onSubmit được gọi với DỮ LIỆU ĐÃ CHỈNH SỬA (và đã chuyển sang SỐ)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 5,
          name: "New Name",
          // 🟢 SỬA TẠI ĐÂY: Mong đợi giá trị là SỐ
          price: 10, 
          quantity: 1,
          category: "Test",
        })
      );
    });
  });
});