package com.estore.shopping.controller;

import com.estore.shopping.dto.*;
import com.estore.shopping.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET /api/cart/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    // POST /api/cart/add
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    // PUT /api/cart/update
    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateCart(@Valid @RequestBody UpdateCartRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(request));
    }

    // DELETE /api/cart/remove/{itemId}
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        cartService.removeCartItem(itemId);
        return ResponseEntity.noContent().build();
    }
}