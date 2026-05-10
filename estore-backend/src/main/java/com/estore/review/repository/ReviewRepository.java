package com.estore.review.repository;

import com.estore.review.document.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    // كل الآراء لمنتج معين — مرتبة من الأحدث
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    // كل الآراء لمستخدم معين
    List<Review> findByUserId(Long userId);
}