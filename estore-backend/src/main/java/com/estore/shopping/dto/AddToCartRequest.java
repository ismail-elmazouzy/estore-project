package com.estore.shopping.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddToCartRequest {

    @NotNull(message = "ID المستخدم مطلوب")
    private Long userId;

    @NotNull(message = "ID المنتج مطلوب")
    private Long productId;

    @NotNull(message = "الكمية مطلوبة")
    @Min(value = 1, message = "الكمية يجب أن تكون 1 على الأقل")
    private Integer quantity;
}