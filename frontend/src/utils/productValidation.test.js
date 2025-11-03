import { validateProduct } from "./productValidation";

// Bắt đầu nhóm test cho Product Validation [cite: 292]
describe("Product Validation Tests", () => {
  // Test case "Happy Path" - Dữ liệu hợp lệ [cite: 324]
  test("TC3: Product hợp lệ không trả về lỗi", () => {
    const product = {
      name: "Laptop Dell", // [cite: 328]
      price: 15000000, // [cite: 329]
      quantity: 10, // [cite: 330]
      description: "Hàng mới, chính hãng",
      category: "Electronics", // [cite: 331]
    };
    const errors = validateProduct(product);
    // Mong đợi không có key nào trong đối tượng errors [cite: 335]
    expect(Object.keys(errors).length).toBe(0);
  });

  // ===== Product Name Validation Tests [cite: 283] =====
  test("TC1: Product name rỗng trả về lỗi", () => {
    const product = { name: "", price: 100, quantity: 1, category: "Test" }; // [cite: 295-304]
    const errors = validateProduct(product);
    expect(errors.name).toBe("Tên sản phẩm không được để trống"); // [cite: 306]
  });

  test("Product name quá ngắn (dưới 3 ký tự) trả về lỗi", () => {
    const product = { name: "ab", price: 100, quantity: 1, category: "Test" };
    const errors = validateProduct(product);
    expect(errors.name).toBe("Tên sản phẩm phải có ít nhất 3 ký tự");
  });

  test("Product name quá dài (trên 100 ký tự) trả về lỗi", () => {
    const longName = "a".repeat(101);
    const product = {
      name: longName,
      price: 100,
      quantity: 1,
      category: "Test",
    };
    const errors = validateProduct(product);
    expect(errors.name).toBe("Tên sản phẩm không được vượt quá 100 ký tự");
  });

  // ===== Price Validation Tests (Boundary Tests) [cite: 284, 345] =====
  test("TC2: Price là số âm trả về lỗi", () => {
    const product = {
      name: "Laptop",
      price: -1000,
      quantity: 10,
      category: "Test",
    }; // [cite: 308-315]
    const errors = validateProduct(product);
    expect(errors.price).toBe("Giá sản phẩm phải lớn hơn 0"); // [cite: 322]
  });

  test("Price là 0 trả về lỗi", () => {
    const product = { name: "Test", price: 0, quantity: 1, category: "Test" };
    const errors = validateProduct(product);
    expect(errors.price).toBe("Giá sản phẩm phải lớn hơn 0");
  });

  test("Price quá lớn (trên 999,999,999) trả về lỗi", () => {
    const product = {
      name: "Test",
      price: 1000000000,
      quantity: 1,
      category: "Test",
    };
    const errors = validateProduct(product);
    expect(errors.price).toBe("Giá sản phẩm không được vượt quá 999,999,999");
  });

  test("Price là 999,999,999 (hợp lệ - boundary test)", () => {
    const product = {
      name: "Test",
      price: 999999999,
      quantity: 1,
      category: "Test",
    };
    const errors = validateProduct(product);
    expect(errors.price).toBeUndefined(); // Không có lỗi
  });

  // ===== Quantity Validation Tests [cite: 285, 345] =====
  test("Quantity là số âm trả về lỗi", () => {
    const product = {
      name: "Test",
      price: 100,
      quantity: -1,
      category: "Test",
    };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe("Số lượng không được nhỏ hơn 0");
  });

  test("Quantity là 0 (hợp lệ - boundary test)", () => {
    const product = { name: "Test", price: 100, quantity: 0, category: "Test" };
    const errors = validateProduct(product);
    expect(errors.quantity).toBeUndefined(); // Không có lỗi
  });

  test("Quantity quá lớn (trên 99,999) trả về lỗi", () => {
    const product = {
      name: "Test",
      price: 100,
      quantity: 100000,
      category: "Test",
    };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe("Số lượng không được vượt quá 99,999");
  });

  // ===== Description Length Test [cite: 286] =====
  test("Description quá dài (trên 500 ký tự) trả về lỗi", () => {
    const longDesc = "a".repeat(501);
    const product = {
      name: "Test",
      price: 100,
      quantity: 1,
      category: "Test",
      description: longDesc,
    };
    const errors = validateProduct(product);
    expect(errors.description).toBe("Mô tả không được vượt quá 500 ký tự");
  });

  // ===== Category Validation Test [cite: 287] =====
  test("Category bị rỗng trả về lỗi", () => {
    const product = { name: "Test", price: 100, quantity: 1, category: "" };
    const errors = validateProduct(product);
    expect(errors.category).toBe("Danh mục không được để trống");
  });

  

  test('TC14: Price bị để trống (null/undefined) trả về lỗi', () => {
    const product = { name: 'Test', price: null, quantity: 1, category: 'Test' };
    const errors = validateProduct(product);
    expect(errors.price).toBe('Giá sản phẩm không được để trống');
  });

  test('TC15: Quantity bị để trống (null/undefined) trả về lỗi', () => {
    const product = { name: 'Test', price: 100, quantity: undefined, category: 'Test' };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe('Số lượng không được để trống');
  });
  
  test('TC16: Quantity không phải là số (NaN) trả về lỗi', () => {
    const product = { name: 'Test', price: 100, quantity: 'abc', category: 'Test' };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe('Số lượng phải là một con số');
  });
});