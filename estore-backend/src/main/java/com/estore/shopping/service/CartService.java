package com.estore.shopping.service;

import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.BusinessException;
import com.estore.exception.ResourceNotFoundException;
import com.estore.shopping.dto.*;
import com.estore.shopping.entity.*;
import com.estore.shopping.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // جلب الكارت — ينشئه تلقائياً إذا لم يوجد
    @Transactional
    public CartResponse getCartByUserId(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().user(
                                userRepository.findById(userId).get()
                        ).build()
                ));

        return toCartResponse(cart);
    }

    // إضافة منتج للكارت
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("المنتج غير موجود"));

        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        // إذا المنتج موجود مسبقاً → زيادة الكمية فقط
        Optional<CartItem> existing = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), product.getId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            cartItemRepository.save(newItem);
        }

        Cart updated = cartRepository.findById(cart.getId()).orElseThrow();
        return toCartResponse(updated);
    }

    // تحديث الكمية
    @Transactional
    public CartResponse updateCartItem(UpdateCartRequest request) {
        CartItem item = cartItemRepository.findById(request.getCartItemId())
                .orElseThrow(() -> new ResourceNotFoundException("العنصر غير موجود"));

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        Cart updated = cartRepository.findById(item.getCart().getId()).orElseThrow();
        return toCartResponse(updated);
    }

    // حذف عنصر
    @Transactional
    public void removeCartItem(Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("العنصر غير موجود"));
        cartItemRepository.delete(item);
    }

    // تفريغ الكارت بعد الطلب
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    // ── Mapping ──────────────────────────────────────────
    private CartResponse toCartResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    BigDecimal subtotal = item.getUnitPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    return CartResponse.CartItemResponse.builder()
                            .itemId(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .imageUrl(item.getProduct().getImageUrl())
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal total = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemResponses)
                .total(total)
                .build();
    }
}