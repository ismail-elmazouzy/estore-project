package com.estore.catalog.dto;

import lombok.*;

@Data
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
}