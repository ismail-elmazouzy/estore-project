package com.estore.billing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotNull(message = "ID المستخدم مطلوب")
    private Long userId;
}