package com.estore.catalog.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "اسم المنتج مطلوب")
    private String name;

    private String description;

    @NotNull(message = "السعر مطلوب")
    @DecimalMin(value = "0.01", message = "السعر يجب أن يكون أكبر من 0")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "ID الكاتيغوري مطلوب")
    private Long categoryId;
}