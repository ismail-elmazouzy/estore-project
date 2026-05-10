package com.estore.customer.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "البريد الإلكتروني مطلوب")
    @Email(message = "صيغة البريد الإلكتروني غير صحيحة")
    private String email;

    @NotBlank(message = "كلمة المرور مطلوبة")
    private String password;
}