import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // (Bạn cần cài @testing-library/jest-dom )
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
    // 1. Hàm validate được gọi
    expect(mockValidateProduct).toHaveBeenCalledTimes(1);

    // 2. Các thông báo lỗi được hiển thị
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

    // 3. Hàm onSubmit không được gọi
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
      target: { value: "20000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Tech" },
    });

    // Click submit
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    // Assert:
    // 1. Hàm validate được gọi
    expect(mockValidateProduct).toHaveBeenCalledTimes(1);

    // 2. Không có thông báo lỗi
    expect(screen.queryByTestId("error-name")).toBeNull();
    expect(screen.queryByTestId("error-price")).toBeNull();

    // 3. Hàm onSubmit được gọi 1 lần
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
