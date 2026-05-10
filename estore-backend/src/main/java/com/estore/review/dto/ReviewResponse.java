package com.estore.review.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private String id;
    private Long productId;
    private Long userId;
    private String authorName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}