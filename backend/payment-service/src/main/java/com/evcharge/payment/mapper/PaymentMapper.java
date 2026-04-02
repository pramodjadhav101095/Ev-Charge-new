package com.evcharge.payment.mapper;

import com.evcharge.payment.dto.PaymentResponse;
import com.evcharge.payment.entity.Payment;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentResponse toResponse(Payment payment);

    List<PaymentResponse> toResponseList(List<Payment> payments);
}
