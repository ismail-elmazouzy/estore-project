package com.estore.customer.dto;

import lombok.*;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}