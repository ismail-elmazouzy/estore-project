package com.estore.review.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotNull(message = "ID المنتج مطلوب")
    private Long productId;

    @NotNull(message = "ID المستخدم مطلوب")
    private Long userId;

    @NotBlank(message = "اسم الكاتب مطلوب")
    private String authorName;

    @NotNull(message = "التقييم مطلوب")
    @Min(value = 1, message = "التقييم الأدنى هو 1")
    @Max(value = 5, message = "التقييم الأقصى هو 5")
    private Integer rating;

    @NotBlank(message = "التعليق مطلوب")
    @Size(max = 1000, message = "التعليق لا يتجاوز 1000 حرف")
    private String comment;
}