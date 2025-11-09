package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.ProductDto;
import com.flogin.exception.ResourceNotFoundException;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Product Controller Unit Tests")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private ProductDto productDto;

    @BeforeEach
    void setUp() {
        productDto = new ProductDto(1L, "Laptop", 15000000, 10, "Electronics");
    }

    @Test
    @DisplayName("POST /api/products - Tạo sản phẩm thành công (201 Created)")
    void testCreateProduct_Success() throws Exception {
        given(productService.createProduct(any(ProductDto.class))).willReturn(productDto);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Laptop"));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Lấy sản phẩm thành công (200 OK)")
    void testGetProductById_Success() throws Exception {
        Long productId = 1L;
        given(productService.getProduct(productId)).willReturn(productDto);

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Laptop"));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Không tìm thấy sản phẩm (404 Not Found)")
    void testGetProductById_NotFound() throws Exception {
        Long productId = 99L;
        given(productService.getProduct(productId))
                .willThrow(new ResourceNotFoundException("Product not found"));

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/products/{id} - Cập nhật sản phẩm thành công (200 OK)")
    void testUpdateProduct_Success() throws Exception {
        Long productId = 1L;
        ProductDto updatedDto = new ProductDto(productId, "Laptop Gaming", 20000000, 5, "Electronics");
        given(productService.updateProduct(eq(productId), any(ProductDto.class))).willReturn(updatedDto);

        mockMvc.perform(put("/api/products/{id}", productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop Gaming"))
                .andExpect(jsonPath("$.price").value(20000000));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - Xóa sản phẩm thành công (204 No Content)")
    void testDeleteProduct_Success() throws Exception {
        Long productId = 1L;
        // hàm void mặc định sẽ không làm gì khi được gọi, đúng với mock

        mockMvc.perform(delete("/api/products/{id}", productId))
                .andExpect(status().isNoContent()); // Mong đợi 204 No Content
    }

    @Test
    @DisplayName("GET /api/products - Lấy danh sách có phân trang (200 OK)")
    void testGetAllProducts_Success() throws Exception {
        Pageable pageable = PageRequest.of(0, 10);
        List<ProductDto> dtoList = Collections.singletonList(productDto);
        Page<ProductDto> productPage = new PageImpl<>(dtoList, pageable, 1);

        given(productService.getAllProducts(any(Pageable.class))).willReturn(productPage);

        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].name").value("Laptop"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }
}