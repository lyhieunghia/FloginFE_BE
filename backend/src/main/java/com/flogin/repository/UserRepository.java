package com.flogin.repository;

import com.flogin.entity.UserEntity; // Import class Entity của bạn
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    
    /**
     * Spring Data JPA sẽ tự động tạo một truy vấn SQL
     * để tìm kiếm UserEntity dựa trên cột 'username'.
     * Dùng Optional để xử lý trường hợp không tìm thấy user.
     */
    Optional<UserEntity> findByUsername(String username);
    
}