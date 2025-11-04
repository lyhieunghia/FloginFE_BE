package com.flogin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;

/**
 * Lớp Controller xử lý các yêu cầu HTTP liên quan đến Product.
 * Ánh xạ các đường dẫn API tới các phương thức của ProductService.
 */
@RestController
@RequestMapping("/api/products") // Tiền tố chung cho tất cả API của product
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1. API Tạo sản phẩm mới
    // POST /api/products
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        ProductDto newProduct = productService.createProduct(productDto);
        return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }

    // 2. API Lấy sản phẩm theo ID
    // GET /api/products/1
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        ProductDto productDto = productService.getProduct(id);
        return ResponseEntity.ok(productDto);
    }

    // 3. API Lấy tất cả sản phẩm (có phân trang)
    // GET /api/products?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(Pageable pageable) {
        Page<ProductDto> productPage = productService.getAllProducts(pageable);
        return ResponseEntity.ok(productPage);
    }

    // 4. API Cập nhật sản phẩm
    // PUT /api/products/1
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        ProductDto updatedProduct = productService.updateProduct(id, productDto);
        return ResponseEntity.ok(updatedProduct);
    }

    // 5. API Xóa sản phẩm
    // DELETE /api/products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content
    }
}
