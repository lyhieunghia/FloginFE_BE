package com.flogin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flogin.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // JpaRepository đã cung cấp sẵn các hàm CRUD và phân trang
    // findById, save, deleteById, findAll(Pageable)
}
