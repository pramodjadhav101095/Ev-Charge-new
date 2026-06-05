package com.evcharge.payment.dto;

import com.evcharge.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
    private Long id;
    private String bookingId;
    private Long userId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentResponse() {
    }

    public PaymentResponse(Long id, String bookingId, Long userId, BigDecimal amount, String currency,
                           PaymentStatus status, String razorpayOrderId, String razorpayPaymentId,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.userId = userId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static PaymentResponseBuilder builder() {
        return new PaymentResponseBuilder();
    }

    public static class PaymentResponseBuilder {
        private Long id;
        private String bookingId;
        private Long userId;
        private BigDecimal amount;
        private String currency;
        private PaymentStatus status;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        PaymentResponseBuilder() {
        }

        public PaymentResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PaymentResponseBuilder bookingId(String bookingId) {
            this.bookingId = bookingId;
            return this;
        }

        public PaymentResponseBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public PaymentResponseBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public PaymentResponseBuilder currency(String currency) {
            this.currency = currency;
            return this;
        }

        public PaymentResponseBuilder status(PaymentStatus status) {
            this.status = status;
            return this;
        }

        public PaymentResponseBuilder razorpayOrderId(String razorpayOrderId) {
            this.razorpayOrderId = razorpayOrderId;
            return this;
        }

        public PaymentResponseBuilder razorpayPaymentId(String razorpayPaymentId) {
            this.razorpayPaymentId = razorpayPaymentId;
            return this;
        }

        public PaymentResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PaymentResponseBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public PaymentResponse build() {
            return new PaymentResponse(id, bookingId, userId, amount, currency, status, razorpayOrderId, razorpayPaymentId, createdAt, updatedAt);
        }

        @Override
        public String toString() {
            return "PaymentResponse.PaymentResponseBuilder(id=" + this.id + ", bookingId=" + this.bookingId + ", userId=" + this.userId + ", amount=" + this.amount + ", currency=" + this.currency + ", status=" + this.status + ", razorpayOrderId=" + this.razorpayOrderId + ", razorpayPaymentId=" + this.razorpayPaymentId + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ")";
        }
    }
}
