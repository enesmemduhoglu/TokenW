package com.w.tokenw.controller;

import com.w.tokenw.dto.CartRequest;
import com.w.tokenw.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProductToCart(@RequestBody CartRequest cartRequest) {
        cartService.addProductToCart(cartRequest);
        return ResponseEntity.ok("Product added to cart successfully");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartRequest>> getCart(@PathVariable Integer userId) {
        List<CartRequest> cartItems = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

}
