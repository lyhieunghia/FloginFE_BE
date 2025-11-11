package com.flogin.repository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;

import com.flogin.entity.Product;

@DataJpaTest
@DisplayName("Product Repository Unit Tests")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.yaml")
class ProductRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    @Test
    @DisplayName("Test lưu và tìm sản phẩm theo ID")
    void testSaveAndFindById() {
        // 1. Arrange: Tạo và lưu một entity vào H2 DB bằng entityManager
        Product newProduct = new Product(null, "Chuột không dây", 500000, 50, "Accessories");
        Product savedProduct = entityManager.persistFlushFind(newProduct);

        // 2. Act: Dùng repository để tìm lại
        Optional<Product> foundProduct = productRepository.findById(savedProduct.getId());

        // 3. Assert: Kiểm tra kết quả
        assertThat(foundProduct).isPresent();
        assertThat(foundProduct.get().getName()).isEqualTo("Chuột không dây");
        assertThat(foundProduct.get().getPrice()).isEqualTo(500000);
    }

    @Test
    @DisplayName("Test tìm sản phẩm không tồn tại")
    void testFindById_NotFound() {
        // 1. Act
        Optional<Product> foundProduct = productRepository.findById(999L);

        // 2. Assert
        assertThat(foundProduct).isEmpty();
    }
}