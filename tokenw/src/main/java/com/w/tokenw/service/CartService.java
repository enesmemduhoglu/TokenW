package com.w.tokenw.service;

import com.w.tokenw.dto.CartRequest;
import com.w.tokenw.dto.ProductDto;
import com.w.tokenw.model.Cart;
import com.w.tokenw.model.Product;
import com.w.tokenw.model.User;
import com.w.tokenw.repository.CartRepository;
import com.w.tokenw.repository.ProductRepository;
import com.w.tokenw.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired
    private final CartRepository cartRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<CartRequest> getCartByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .stream()
                .map(cart -> {
                    CartRequest cartRequest = new CartRequest();
                    cartRequest.setUserId(cart.getUser().getId());
                    cartRequest.setProductId(cart.getProduct().getProductId());
                    cartRequest.setQuantity(cart.getQuantity());

                    cartRequest.setProductName(cart.getProduct().getProductName());
                    cartRequest.setProductDescription(cart.getProduct().getProductDescription());
                    cartRequest.setProductPrice(cart.getProduct().getProductPrice());
                    cartRequest.setProductImage(cart.getProduct().getProductImage());
                    return cartRequest;
                })
                .collect(Collectors.toList());
    }


    public void addProductToCart(CartRequest cartRequest) {
        User user = userRepository.findById(cartRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(cartRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Cart> existingCartItem = cartRepository.findByUserAndProduct(user, product);

        if (existingCartItem.isPresent()) {
            Cart cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartRequest.getQuantity());
            cartRepository.save(cartItem);
        } else {
            Cart cartItem = new Cart();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(cartRequest.getQuantity());
            cartRepository.save(cartItem);
        }
    }
}
