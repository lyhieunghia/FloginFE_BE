import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import App from "./App"; // Test từ App (file router)
import axios from "axios";

// Helper function để reset DB (đã có từ bước trước)
const resetDatabase = async () => {
  try {
    await axios.post("http://localhost:8080/api/testing/reset");
  } catch (error) {
    throw new Error("Database reset failed. Stopping tests.");
  }
};

describe("App Component Integration Tests (Req 4.2.1)", () => {
  beforeEach(async () => {
    // Chạy reset DB thật
    await resetDatabase();
    // Mock các hàm của window
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    window.history.pushState({}, "Test page", "/");
  });

  // =================================================================
  // CÁC TEST TÍCH HỢP "HAPPY PATH" (YÊU CẦU 4.2.1) - GIỮ NGUYÊN
  // =================================================================

  // Test 1: Yêu cầu 4.2.1(a) - Tải danh sách rỗng
  test("Req 4.2.1(a): Nên tải và hiển thị danh sách (rỗng) từ API", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(
      await screen.findByText("Không có sản phẩm nào.")
    ).toBeInTheDocument();
  });

  // Test 2: Yêu cầu 4.2.1(b) - Create
  test("Req 4.2.1(b) - Create: Nên tạo sản phẩm mới và cập nhật danh sách", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
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
  });

  // Test 3: Yêu cầu 4.2.1(b) - Edit
  test("Req 4.2.1(b) - Edit: Nên gọi hàm (alert) khi nhấn nút Sửa", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Sản phẩm Sẽ Được Sửa" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 2 },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: 2 },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Edit" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));
    await screen.findByText("Thêm sản phẩm thành công!");

    const productCell = await screen.findByText("Sản phẩm Sẽ Được Sửa");
    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm sẽ được sửa/i,
    });

    // Tìm button Sửa dựa trên testid (ví dụ: edit-btn-1)
    const editButton = within(productRow).getByTestId(/edit-btn-/);
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Chức năng Sửa cho sản phẩm: Sản phẩm Sẽ Được Sửa (chưa cài đặt)"
      );
    });
  });

  // Test 4: Yêu cầu 4.2.1(a) - Luồng Xóa
  test("Req 4.2.1(a) - Delete: Nên xóa sản phẩm khỏi danh sách", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Sản phẩm Sẽ Bị Xóa" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Delete" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));
    await screen.findByText("Thêm sản phẩm thành công!");

    const productCell = await screen.findByText("Sản phẩm Sẽ Bị Xóa");
    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm sẽ bị xóa/i,
    });

    // Tìm button Xóa dựa trên testid (ví dụ: delete-btn-1)
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
  });

  // Test 5: Yêu cầu 4.2.1(c) - Xem chi tiết
  test("Req 4.2.1(c): Nên hiển thị chi tiết sản phẩm khi click vào link", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // ----- PHẦN A: Thêm một sản phẩm (Dùng API thật) -----
    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Chi tiết Laptop" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 123456 },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: 7 },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Detail" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    const productLink = await screen.findByText("Chi tiết Laptop");
    expect(productLink).toBeInTheDocument();

    // ----- PHẦN B: Click vào link sản phẩm (Dùng API thật) -----
    fireEvent.click(productLink);

    // ----- PHẦN C: Xác minh trang chi tiết (ProductDetail) -----
    const detailName = await screen.findByTestId("product-detail-name");
    expect(detailName).toHaveTextContent("Chi tiết Laptop");
    const detailPrice = await screen.findByTestId("product-detail-price");
    expect(detailPrice).toHaveTextContent("Giá: 123,456 VND");
    const detailQty = await screen.findByTestId("product-detail-quantity");
    expect(detailQty).toHaveTextContent("Số lượng: 7");
    const detailCat = await screen.findByTestId("product-detail-category");
    expect(detailCat).toHaveTextContent("Danh mục: Detail");
    expect(screen.getByText("Quay về danh sách")).toBeInTheDocument();
  });

  // =================================================================
  // CÁC TEST MỚI: "SAD PATH" ĐỂ TĂNG COVERAGE
  // =================================================================

  // Test 6: (Cover ProductPage.js: 22-24)
  test("Sad Path: Nên hiển thị lỗi khi API tải danh sách thất bại", async () => {
    // Tạm thời ghi đè axios.get để nó trả về lỗi
    const getSpy = jest
      .spyOn(axios, "get")
      .mockRejectedValueOnce(new Error("Network Error"));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Assert: Thông báo lỗi từ ProductPage.js (dòng 23) được hiển thị
    const errorMessage = await screen.findByText(
      "Lỗi khi tải danh sách sản phẩm"
    );
    expect(errorMessage).toBeInTheDocument();

    // Khôi phục lại hàm axios.get gốc cho các test sau
    getSpy.mockRestore();

    // ⭐️ THÊM TEST CHO NHÁNH PHÂN TRANG ⭐️
    // Giả lập API GET trả về dữ liệu có phân trang
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
    const getSpyPaginated = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: paginatedData });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Assert: Sản phẩm được hiển thị (chứng tỏ nhánh 16-17 đã chạy)
    expect(await screen.findByText("Sản phẩm Phân Trang")).toBeInTheDocument();
    getSpyPaginated.mockRestore();
  });

  // Test 7: (Cover ProductPage.js: 39-40)
  test("Sad Path: Nên hiển thị lỗi khi thêm sản phẩm thất bại", async () => {
    // 1. Ghi đè hàm POST để trả về lỗi
    // (Hàm GET để tải danh sách rỗng vẫn chạy thật)
    const postSpy = jest
      .spyOn(axios, "post")
      .mockRejectedValueOnce(new Error("Create Error"));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await screen.findByText("Không có sản phẩm nào."); // Đợi trang tải xong

    // Action: Điền form và submit
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

    // Assert: Thông báo lỗi từ ProductPage.js (dòng 41) được hiển thị
    const errorMessage = await screen.findByText("Lỗi khi thêm sản phẩm");
    expect(errorMessage).toBeInTheDocument();

    // Khôi phục hàm post
    postSpy.mockRestore();
  });

  // Test 8: (Cover ProductPage.js: 52-53)
  test("Sad Path: Nên hiển thị lỗi khi xóa sản phẩm thất bại", async () => {
    const mockProduct = {
      id: 99,
      name: "Sản phẩm Xóa Lỗi",
      price: 1,
      quantity: 1,
      category: "Delete",
    };

    // 1. Tạm thời MOCK hàm GET để trả về 1 sản phẩm
    const getSpy = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: [mockProduct] });

    // 2. Tạm thời MOCK hàm DELETE trả về lỗi
    const deleteSpy = jest
      .spyOn(axios, "delete")
      .mockRejectedValueOnce(new Error("Delete Error"));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Tìm sản phẩm và nút xóa của nó
    const productCell = await screen.findByText("Sản phẩm Xóa Lỗi");
    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm xóa lỗi/i,
    });

    // Phải dùng /delete-btn-99/ vì ID sản phẩm là 99
    const deleteButton = within(productRow).getByTestId(/delete-btn-99/);

    // Action: Click xóa
    fireEvent.click(deleteButton);
    expect(window.confirm).toHaveBeenCalled(); // Đảm bảo confirm đã được gọi

    // Assert: Thông báo lỗi từ ProductPage.js (dòng 54) được hiển thị
    const errorMessage = await screen.findByText("Lỗi khi xóa sản phẩm");
    expect(errorMessage).toBeInTheDocument();

    // Khôi phục các spy
    getSpy.mockRestore();
    deleteSpy.mockRestore();
  });

  // Test 9: (Cover ProductDetail.js: 17-18, 24)
  test("Sad Path: Nên hiển thị lỗi khi xem chi tiết sản phẩm không tồn tại", async () => {
    const mockProduct = {
      id: 101,
      name: "Sản phẩm xem chi tiết",
      price: 1,
      quantity: 1,
      category: "Detail",
    };

    // Tạm thời ghi đè axios.get
    const getSpy = jest.spyOn(axios, "get");

    // Lần gọi 1 (cho ProductPage): Trả về 1 sản phẩm
    getSpy.mockResolvedValueOnce({ data: [mockProduct] });

    // Lần gọi 2 (cho ProductDetail): Trả về lỗi
    getSpy.mockRejectedValueOnce(new Error("Not Found"));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Action: Click vào link sản phẩm
    const productLink = await screen.findByText("Sản phẩm xem chi tiết");
    fireEvent.click(productLink);

    // Assert: Thông báo lỗi từ ProductDetail.js (dòng 20) được hiển thị
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toHaveTextContent("Không tìm thấy sản phẩm");

    // Khôi phục spy
    getSpy.mockRestore();
  });

  test("Sad Path: Không nên xóa sản phẩm nếu người dùng nhấn 'Cancel'", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // 1. Tạo sản phẩm (dùng API thật)
    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Sản phẩm không xóa" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    const productCell = await screen.findByText("Sản phẩm không xóa");

    // 2. Giả lập window.confirm trả về "false" (nhấn Cancel)
    window.confirm.mockReturnValueOnce(false);

    // 3. Click nút xóa
    const productRow = await screen.findByRole("row", {
      name: /Sản phẩm không xóa/i,
    });
    const deleteButton = within(productRow).getByTestId(/delete-btn-/);
    fireEvent.click(deleteButton);

    // 4. Assert: Sản phẩm VẪN CÒN
    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText("Xóa sản phẩm thành công!")).toBeNull();
    expect(await screen.findByText("Sản phẩm không xóa")).toBeInTheDocument();
  });

  test("Sad Path: Nên xử lý khi API trả về cấu trúc dữ liệu không hợp lệ", async () => {
    // Giả lập API GET trả về dữ liệu thành công, nhưng cấu trúc sai
    // (Không phải mảng, cũng không có .content)
    const getSpyInvalid = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: { message: "API trả về lỗi cấu trúc" } });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Assert: Component nên xử lý lỗi này bằng cách hiển thị "Không có sản phẩm"
    // (Vì nhánh 'else' cuối cùng trả về [])
    expect(
      await screen.findByText("Không có sản phẩm nào.")
    ).toBeInTheDocument();

    getSpyInvalid.mockRestore();
  });
});
