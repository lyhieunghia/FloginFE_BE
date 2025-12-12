package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@ContextConfiguration(classes = {ProductController.class, ProductControllerIntegrationTest.TestConfig.class})
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {

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

    // Yêu cầu a) Test POST /api/products (Create)
    @Test
    @DisplayName("POST /api/products - Tạo sản phẩm mới")
    void testCreateProduct() throws Exception {
        given(productService.createProduct(any(ProductDto.class))).willReturn(productDto);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Laptop")))
                .andExpect(jsonPath("$.price", is(15000000.0)));
    }

    // Yêu cầu b) Test GET /api/products (Read all)
    @Test
    @DisplayName("GET /api/products - Lấy danh sách sản phẩm (có phân trang)")
    void testGetAllProducts() throws Exception {
        // Chuẩn bị dữ liệu giả lập (Mock data)
        ProductDto p1 = new ProductDto(1L, "Laptop", 15000000, 10, "Electronics");
        ProductDto p2 = new ProductDto(2L, "Mouse", 200000, 50, "Accessories");
        List<ProductDto> productList = Arrays.asList(p1, p2);
        Pageable pageable = PageRequest.of(0, 10);
        Page<ProductDto> productPage = new PageImpl<>(productList, pageable, productList.size());

        // Giả lập hành vi của service
        given(productService.getAllProducts(any(Pageable.class))).willReturn(productPage);

        // Thực hiện request và kiểm tra kết quả
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // Kiểm tra cấu trúc JSON trả về từ Page<ProductDto>
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[0].name", is("Laptop")))
                .andExpect(jsonPath("$.content[1].name", is("Mouse")))
                .andExpect(jsonPath("$.totalElements", is(2)));
    }

    // Yêu cầu c) Test GET /api/products/{id} (Read one)
    @Test
    @DisplayName("GET /api/products/{id} - Lấy chi tiết một sản phẩm")
    void testGetProductById() throws Exception {
        Long productId = 1L;
        given(productService.getProduct(productId)).willReturn(productDto);

        mockMvc.perform(get("/api/products/{id}", productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Laptop")));
    }

    // Yêu cầu d) Test PUT /api/products/{id} (Update)
    @Test
    @DisplayName("PUT /api/products/{id} - Cập nhật thông tin sản phẩm")
    void testUpdateProduct() throws Exception {
        Long productId = 1L;
        ProductDto updatedDto = new ProductDto(productId, "Laptop Pro", 25000000, 5, "Electronics");
        given(productService.updateProduct(eq(productId), any(ProductDto.class))).willReturn(updatedDto);

        mockMvc.perform(put("/api/products/{id}", productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Laptop Pro")))
                .andExpect(jsonPath("$.price", is(25000000.0)));
    }

    // Yêu cầu e) Test DELETE /api/products/{id} (Delete)
    @Test
    @DisplayName("DELETE /api/products/{id} - Xóa một sản phẩm")
    void testDeleteProduct() throws Exception {
        Long productId = 1L;
        // Service trả về void nên không cần mock return value, chỉ cần nó không ném lỗi là được.

        mockMvc.perform(delete("/api/products/{id}", productId))
                .andExpect(status().isNoContent()); // Mong đợi mã 204 No Content
    }

    @Configuration
    @EnableWebSecurity
    static class TestConfig {
        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }
}