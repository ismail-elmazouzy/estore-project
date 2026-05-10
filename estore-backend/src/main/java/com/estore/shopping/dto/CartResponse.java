package com.estore.shopping.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private Long cartId;
    private Long userId;
    private List<CartItemResponse> items;
    private BigDecimal total;

    @Data
    @Builder
    public static class CartItemResponse {
        private Long itemId;
        private Long productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}