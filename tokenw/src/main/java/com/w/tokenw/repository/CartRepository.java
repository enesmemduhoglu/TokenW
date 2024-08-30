package com.w.tokenw.repository;

import com.w.tokenw.model.Cart;
import com.w.tokenw.model.Product;
import com.w.tokenw.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByUser(User user);

    List<Cart> findAll();

    Optional<Cart> findByUserAndProduct(User user, Product product);

}
