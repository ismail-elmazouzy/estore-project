package com.estore.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "اسم الكاتيغوري مطلوب")
    private String name;

    private String description;
}