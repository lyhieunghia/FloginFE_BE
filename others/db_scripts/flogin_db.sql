-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 05, 2025 lúc 05:45 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `flogin_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `quantity`, `description`, `category`) VALUES
(1, 'Laptop Dell XPS 13', 35000000, 10, 'Laptop mỏng nhẹ cao cấp', 'Electronics'),
(2, 'MacBook Pro M2', 45000000, 5, 'Apple MacBook Pro chip M2', 'Electronics'),
(3, 'Chuột Logitech MX Master 3', 2500000, 50, 'Chuột không dây công thái học', 'Accessories'),
(4, 'Bàn phím Keychron K2', 1800000, 30, 'Bàn phím cơ layout 75%', 'Accessories'),
(5, 'Màn hình LG UltraGear', 8500000, 15, 'Màn hình Gaming 27 inch 144Hz', 'Electronics'),
(6, 'Tai nghe Sony WH-1000XM5', 7000000, 20, 'Tai nghe chống ồn chủ động', 'Audio'),
(7, 'Loa Marshall Stanmore III', 9500000, 8, 'Loa bluetooth phong cách cổ điển', 'Audio'),
(8, 'iPhone 15 Pro Max', 33000000, 12, 'Điện thoại iPhone mới nhất', 'Phone'),
(9, 'Samsung Galaxy S24 Ultra', 30000000, 15, 'Điện thoại Android cao cấp', 'Phone'),
(10, 'iPad Air 5', 14000000, 25, 'Máy tính bảng Apple', 'Tablet');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`) VALUES
(1, 'testuser', 'Test123', 'test@example.com'),
(2, 'admin', 'Admin123', 'admin@example.com');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
