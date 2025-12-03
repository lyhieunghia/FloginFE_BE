// Mock toàn bộ module axios
jest.mock("axios");

import axios from "axios";
import {
  getProductById,
  createProduct,
  deleteProduct,
  getAllProducts,
} from "../services/productService";
import { updateProduct } from "../services/productService";
const mockedAxios = axios;

describe("Product Service Unit Tests", () => {
  beforeEach(() => {
    // Xóa lịch sử mock trước mỗi test - ensure methods exist before clearing
    jest.clearAllMocks();
    if (mockedAxios.get && mockedAxios.get.mockClear) {
      mockedAxios.get.mockClear();
    }
    if (mockedAxios.post && mockedAxios.post.mockClear) {
      mockedAxios.post.mockClear();
    }
    if (mockedAxios.put && mockedAxios.put.mockClear) {
      mockedAxios.put.mockClear();
    }
    if (mockedAxios.delete && mockedAxios.delete.mockClear) {
      mockedAxios.delete.mockClear();
    }
  });

  // Test hàm getAllProducts (cover các hàm khác)
  test("getAllProducts nên gọi axios.get", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    await getAllProducts();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/products"
    );
  });

  // Test hàm createProduct (cover các hàm khác)
  test("createProduct nên gọi axios.post", async () => {
    const product = { name: "Test", price: 100 };
    mockedAxios.post.mockResolvedValue({ data: product });
    await createProduct(product);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/products",
      product
    );
  });

  // Test hàm deleteProduct (cover các hàm khác)
  test("deleteProduct nên gọi axios.delete", async () => {
    mockedAxios.delete.mockResolvedValue({});
    await deleteProduct(1);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:8080/api/products/1"
    );
  });

  // ⭐️ TEST QUAN TRỌNG ĐỂ COVER DÒNG 35 ⭐️
  test("getProductById nên gọi axios.get với đúng ID", async () => {
    const mockProduct = { id: 5, name: "Sản phẩm test" };
    // Giả lập API trả về
    mockedAxios.get.mockResolvedValue({ data: mockProduct });

    // Gọi hàm cần test
    const result = await getProductById(5);

    // Kiểm tra
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/products/5"
    );
    expect(result.data).toBe(mockProduct);
  });

  test("updateProduct nên gọi axios.put với đúng ID và data", async () => {
    const productData = { name: "Updated Product", price: 150 };
    mockedAxios.put.mockResolvedValue({ data: { id: 1, ...productData } });

    await updateProduct(1, productData);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:8080/api/products/1",
      productData
    );
  });

  // Test kịch bản API trả về có phân trang (covers ProductPage line 16-17)
  test("getAllProducts nên xử lý dữ liệu có phân trang", async () => {
    const paginatedResponse = {
      content: [{ id: 1, name: "Test" }],
      totalPages: 1,
    };
    mockedAxios.get.mockResolvedValue({ data: paginatedResponse });

    // Gọi hàm
    const result = await getAllProducts();

    // Kiểm tra
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/products"
    );
    expect(result.data).toBe(paginatedResponse);
  });
});
