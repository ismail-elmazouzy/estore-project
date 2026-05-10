package com.estore.review.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reviews")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Review {

    @Id
    private String id;

    // مرجع للمنتج في MySQL
    private Long productId;

    // مرجع للمستخدم في MySQL
    private Long userId;

    private String authorName;

    // من 1 إلى 5
    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;
}