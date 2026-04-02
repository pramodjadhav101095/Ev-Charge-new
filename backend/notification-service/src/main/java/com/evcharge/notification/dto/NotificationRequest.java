package com.evcharge.notification.dto;

import com.evcharge.notification.entity.NotificationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @NotNull
    private Long userId;

    @NotNull
    private NotificationType type;

    private String recipient; // Optional, overrides user profile if provided

    private String subject;

    @NotNull
    private String content;
}
