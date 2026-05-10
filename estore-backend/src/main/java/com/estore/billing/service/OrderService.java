package com.estore.billing.service;

import com.estore.billing.dto.*;
import com.estore.billing.entity.*;
import com.estore.billing.repository.OrderRepository;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.BusinessException;
import com.estore.exception.ResourceNotFoundException;
import com.estore.inventory.service.InventoryService;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.entity.CartItem;
import com.estore.shopping.repository.CartRepository;
import com.estore.shopping.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final InventoryService inventoryService;
    private final CartService cartService;

    // إنشاء طلب من الكارت
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود"));

        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new BusinessException("لا يوجد كارت لهذا المستخدم"));

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("الكارت فارغ — لا يمكن إنشاء طلب");
        }

        // بناء الطلب
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .orderItems(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {

            // تخفيض المخزون
            inventoryService.decreaseStock(
                    cartItem.getProduct().getId(),
                    cartItem.getQuantity()
            );

            BigDecimal subtotal = cartItem.getUnitPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .build();

            order.getOrderItems().add(orderItem);
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        // تفريغ الكارت بعد الطلب
        cartService.clearCart(request.getUserId());

        return toOrderResponse(saved);
    }

    // سجل الطلبات
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("المستخدم غير موجود");
        }
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId)
                .stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    // ── Mapping ──────────────────────────────────────────
    private OrderResponse toOrderResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> {
                    BigDecimal subtotal = item.getUnitPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    return OrderResponse.OrderItemResponse.builder()
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(items)
                .build();
    }
}