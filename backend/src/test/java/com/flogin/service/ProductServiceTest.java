package com.flogin.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.exception.ResourceNotFoundException;
import com.flogin.repository.ProductRepository;

@DisplayName("Product Service Unit Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        // Khởi tạo các mock object
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("TC1: Tạo sản phẩm mới thành công")
    void testCreateProduct() {
        // 1. Arrange (Chuẩn bị dữ liệu)
        ProductDto productDto = new ProductDto(
                "Laptop", 15000000, 10, "Electronics"
        );
        Product product = new Product(
                1L, "Laptop", 15000000, 10, "Electronics"
        );

        // Giả lập hành vi của repository khi save
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // 2. Act (Thực thi)
        ProductDto result = productService.createProduct(productDto);

        // 3. Assert (Kiểm tra kết quả)
        assertNotNull(result);
        assertEquals(1L, result.getId()); // Kiểm tra ID đã được gán
        assertEquals("Laptop", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC2: Lấy thông tin sản phẩm theo ID thành công")
    void testGetProduct_Success() {
        // 1. Arrange
        Long productId = 1L;
        Product product = new Product(
                productId, "Laptop", 15000000, 10, "Electronics"
        );

        // Giả lập repository trả về sản phẩm
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // 2. Act
        ProductDto result = productService.getProduct(productId);

        // 3. Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Laptop", result.getName());
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName("TC3: Lấy thông tin sản phẩm không tìm thấy (Not Found)")
    void testGetProduct_NotFound() {
        // 1. Arrange
        Long productId = 99L;

        // Giả lập repository không tìm thấy sản phẩm
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // 2. Act & 3. Assert
        // Kiểm tra xem exception ResourceNotFoundException có được ném ra không
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> productService.getProduct(productId)
        );

        assertEquals("Product not found with id: " + productId, exception.getMessage());
        verify(productRepository, times(1)).findById(productId);
    }


    @Test
    @DisplayName("TC4: Cập nhật sản phẩm thành công")
    void testUpdateProduct_Success() {
        // 1. Arrange
        Long productId = 1L;
        ProductDto updateDto = new ProductDto(
                "Laptop Gaming", 20000000, 5, "Electronics"
        );
        Product existingProduct = new Product(
                productId, "Laptop", 15000000, 10, "Electronics"
        );
        Product updatedProduct = new Product(
                productId, "Laptop Gaming", 20000000, 5, "Electronics"
        );

        // Giả lập tìm thấy sản phẩm cũ
        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        // Giả lập lưu sản phẩm đã cập nhật
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        // 2. Act
        ProductDto result = productService.updateProduct(productId, updateDto);

        // 3. Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Laptop Gaming", result.getName());
        assertEquals(20000000, result.getPrice());
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC5: Cập nhật sản phẩm không tìm thấy (Not Found)")
    void testUpdateProduct_NotFound() {
        // 1. Arrange
        Long productId = 99L;
        ProductDto updateDto = new ProductDto(
                "Laptop Gaming", 20000000, 5, "Electronics"
        );

        // Giả lập không tìm thấy sản phẩm
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // 2. Act & 3. Assert
        assertThrows(
                ResourceNotFoundException.class,
                () -> productService.updateProduct(productId, updateDto)
        );

        // Đảm bảo hàm save không bao giờ được gọi
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("TC6: Xóa sản phẩm thành công")
    void testDeleteProduct_Success() {
        // 1. Arrange
        Long productId = 1L;
        Product existingProduct = new Product(
                productId, "Laptop", 15000000, 10, "Electronics"
        );

        // Giả lập tìm thấy sản phẩm
        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        // Giả lập hàm delete (không trả về gì)
        doNothing().when(productRepository).delete(existingProduct);

        // 2. Act
        productService.deleteProduct(productId);

        // 3. Assert
        // Kiểm tra xem findById và delete đã được gọi
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).delete(existingProduct);
    }

    @Test
    @DisplayName("TC7: Xóa sản phẩm không tìm thấy (Not Found)")
    void testDeleteProduct_NotFound() {
        // 1. Arrange
        Long productId = 99L;

        // Giả lập không tìm thấy sản phẩm
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // 2. Act & 3. Assert
        assertThrows(
                ResourceNotFoundException.class,
                () -> productService.deleteProduct(productId)
        );

        // Đảm bảo hàm delete không bao giờ được gọi
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, never()).delete(any(Product.class));
    }

    @Test
    @DisplayName("TC8: Lấy tất cả sản phẩm (phân trang)")
    void testGetAllProducts() {
        // 1. Arrange
        Pageable pageable = PageRequest.of(0, 10); // Trang 0, 10 phần tử
        Product product = new Product(1L, "Laptop", 15000000, 10, "Electronics");
        List<Product> productList = Collections.singletonList(product);
        Page<Product> productPage = new PageImpl<>(productList, pageable, 1);

        // Giả lập hàm findAll(pageable)
        when(productRepository.findAll(pageable)).thenReturn(productPage);

        // 2. Act
        Page<ProductDto> resultPage = productService.getAllProducts(pageable);

        // 3. Assert
        assertNotNull(resultPage);
        assertEquals(1, resultPage.getTotalElements()); // Tổng số phần tử
        assertEquals(1, resultPage.getContent().size()); // Số phần tử ở trang hiện tại
        assertEquals("Laptop", resultPage.getContent().get(0).getName());
        verify(productRepository, times(1)).findAll(pageable);
    }
<<<<<<< HEAD
    
    @Test
    @DisplayName("TC9: [PASS] Xử lý lỗi khi tạo sản phẩm (ví dụ: lỗi DB)")
=======
    @Test
    @DisplayName("TC9: [THẤT BẠI] Cố tình kiểm tra sai tên sản phẩm khi update")
    void testUpdateProduct_DeliberateFailure() {
        // 1. Arrange
        Long productId = 1L;
        ProductDto updateDto = new ProductDto("Laptop Gaming", 20000000, 5, "Electronics");
        Product existingProduct = new Product(productId, "Laptop", 15000000, 10, "Electronics");
        Product updatedProduct = new Product(productId, "Laptop Gaming", 20000000, 5, "Electronics");

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        // 2. Act
        ProductDto result = productService.updateProduct(productId, updateDto);

        // 3. Assert (CỐ TÌNH SAI)
        // Logic nghiệp vụ trả về "Laptop Gaming", nhưng chúng ta mong đợi "Sai Tên"
        // Test này sẽ FAIL (màu đỏ)
        assertEquals("Sai Tên", result.getName(), "Test case này bị fail do mong đợi tên sản phẩm không chính xác");
    }

    @Test
    @DisplayName("TC10: [THẤT BẠI] Cố tình kiểm tra sai ID sản phẩm khi lấy chi tiết")
    void testGetProduct_DeliberateFailure() {
        // 1. Arrange
        Long productId = 5L;
        Product product = new Product(productId, "Chuột", 500000, 20, "Accessory");
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // 2. Act
        ProductDto result = productService.getProduct(productId);

        // 3. Assert (CỐ TÌNH SAI)
        // Logic nghiệp vụ trả về ID là 5L, nhưng chúng ta mong đợi 999L
        // Test này sẽ FAIL (màu đỏ)
        assertEquals(999L, result.getId(), "Test case nay bi fail do mong doi ID khong chinh xac");
    }


    @Test
    @DisplayName("TC11: [PASS] Xử lý lỗi khi tạo sản phẩm (ví dụ: lỗi DB)")
>>>>>>> c119142 (Unit test backend_product)
    void testCreateProduct_DatabaseError() {
        // 1. Arrange
        ProductDto productDto = new ProductDto("Laptop", 15000000, 10, "Electronics");

        // Giả lập repository ném ra lỗi DataAccessException khi save
        // (Đây là một lớp cha chung cho các lỗi liên quan đến CSDL của Spring)
        when(productRepository.save(any(Product.class)))
                .thenThrow(new DataAccessException("Simulating DB Error") {});

        // 2. Act & 3. Assert
        // Kiểm tra xem Service có ném ra đúng lỗi DataAccessException không
        // Test này sẽ PASS (màu xanh) vì nó bắt đúng lỗi mong đợi
        assertThrows(
                DataAccessException.class,
                () -> productService.createProduct(productDto),
                "Service nên ném ra DataAccessException khi repository thất bại"
        );

        verify(productRepository, times(1)).save(any(Product.class));
    }
}
