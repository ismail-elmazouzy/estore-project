package com.estore.catalog.repository;

import com.estore.catalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // بحث بالاسم أو الوصف
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description);

    // منتجات كاتيغوري معينة
    List<Product> findByCategoryId(Long categoryId);
}