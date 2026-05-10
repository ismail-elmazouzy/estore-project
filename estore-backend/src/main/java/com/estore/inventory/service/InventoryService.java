package com.estore.inventory.service;

import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.BusinessException;
import com.estore.exception.ResourceNotFoundException;
import com.estore.inventory.entity.Inventory;
import com.estore.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    // تعيين أو تحديث الكمية
    @Transactional
    public Inventory setStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("المنتج غير موجود: " + productId));

        Inventory inventory = inventoryRepository
                .findByProductId(productId)
                .orElse(Inventory.builder().product(product).build());

        inventory.setQuantity(quantity);
        return inventoryRepository.save(inventory);
    }

    // تخفيض الكمية عند الطلب
    @Transactional
    public void decreaseStock(Long productId, int quantityOrdered) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("المخزون غير موجود للمنتج: " + productId));

        if (inventory.getQuantity() < quantityOrdered) {
            throw new BusinessException(
                    "المخزون غير كافٍ — متوفر: " + inventory.getQuantity() +
                            " — مطلوب: " + quantityOrdered
            );
        }

        inventory.setQuantity(inventory.getQuantity() - quantityOrdered);
        inventoryRepository.save(inventory);
    }

    // جلب الكمية المتوفرة
    @Transactional(readOnly = true)
    public Integer getStock(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(Inventory::getQuantity)
                .orElse(0);
    }
}