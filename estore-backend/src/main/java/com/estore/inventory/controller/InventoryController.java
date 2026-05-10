package com.estore.inventory.controller;

import com.estore.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // GET /api/inventory/{productId}
    @GetMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> getStock(@PathVariable Long productId) {
        Integer stock = inventoryService.getStock(productId);
        return ResponseEntity.ok(Map.of(
                "productId", productId,
                "stock", stock
        ));
    }

    // PUT /api/inventory/{productId}?quantity=50
    @PutMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> updateStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        inventoryService.setStock(productId, quantity);
        return ResponseEntity.ok(Map.of(
                "message", "تم تحديث المخزون",
                "productId", productId,
                "newQuantity", quantity
        ));
    }
}