package com.w.tokenw.repository;

import com.w.tokenw.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> findByProductName(String productName);

    Optional<Product> findById(Integer id);

    List<Product> findAll();
}
