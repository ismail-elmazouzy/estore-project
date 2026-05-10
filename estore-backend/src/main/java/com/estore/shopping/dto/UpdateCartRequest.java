package com.estore.shopping.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateCartRequest {

    @NotNull(message = "ID العنصر مطلوب")
    private Long cartItemId;

    @NotNull(message = "الكمية مطلوبة")
    @Min(value = 1, message = "الكمية يجب أن تكون 1 على الأقل")
    private Integer quantity;
}