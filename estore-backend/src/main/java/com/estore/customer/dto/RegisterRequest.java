package com.estore.customer.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "الاسم الأول مطلوب")
    private String firstName;

    @NotBlank(message = "الاسم الأخير مطلوب")
    private String lastName;

    @NotBlank(message = "البريد الإلكتروني مطلوب")
    @Email(message = "صيغة البريد الإلكتروني غير صحيحة")
    private String email;

    @NotBlank(message = "كلمة المرور مطلوبة")
    @Size(min = 6, message = "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل")
    private String password;
}