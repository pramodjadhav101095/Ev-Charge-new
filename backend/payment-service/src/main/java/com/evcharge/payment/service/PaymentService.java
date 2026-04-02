package com.evcharge.payment.service;

import com.evcharge.payment.dto.PaymentRequest;
import com.evcharge.payment.dto.PaymentResponse;
import com.evcharge.payment.dto.PaymentVerificationRequest;
import com.evcharge.payment.entity.Payment;
import com.evcharge.payment.entity.PaymentStatus;
import com.evcharge.payment.mapper.PaymentMapper;
import com.evcharge.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository repository;

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private PaymentMapper mapper;

    @Autowired
    private PaymentEventProducer eventProducer; // To be implemented

    @Transactional
    public PaymentResponse initiatePayment(PaymentRequest request) {
        try {
            String razorpayOrderId;
            if (request.isMock()) {
                razorpayOrderId = "MOCK_ORD_" + System.currentTimeMillis();
            } else {
                Order order = razorpayService.createOrder(request.getAmount(), request.getCurrency(),
                        request.getBookingId());
                razorpayOrderId = order.get("id");
            }

            Payment payment = Payment.builder()
                    .bookingId(request.getBookingId())
                    .userId(request.getUserId())
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .status(PaymentStatus.PENDING)
                    .razorpayOrderId(razorpayOrderId)
                    .build();

            return mapper.toResponse(repository.save(payment));
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to initiate Razorpay order: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        Payment payment = repository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(
                        () -> new RuntimeException("Payment not found for Order ID: " + request.getRazorpayOrderId()));

        boolean isValid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        if (isValid) {
            processSuccessfulPayment(payment, request.getRazorpayPaymentId(), request.getRazorpaySignature());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            if (eventProducer != null) {
                eventProducer.sendPaymentFailedEvent(payment);
            }
        }

        return mapper.toResponse(repository.save(payment));
    }

    @Transactional
    public PaymentResponse verifyMockPayment(PaymentVerificationRequest request) {
        Payment payment = repository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(
                        () -> new RuntimeException(
                                "Payment not found for Mock Order ID: " + request.getRazorpayOrderId()));

        if (!payment.getRazorpayOrderId().startsWith("MOCK_ORD_")) {
            throw new RuntimeException("Not a mock order: " + request.getRazorpayOrderId());
        }

        processSuccessfulPayment(payment, "MOCK_PAY_" + System.currentTimeMillis(), "MOCK_SIG");

        return mapper.toResponse(repository.save(payment));
    }

    private void processSuccessfulPayment(Payment payment, String paymentId, String signature) {
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);

        if (eventProducer != null) {
            eventProducer.sendPaymentSuccessEvent(payment);
        }
    }

    public List<PaymentResponse> getUserTransactions(Long userId) {
        return mapper.toResponseList(repository.findByUserId(userId));
    }

    public PaymentResponse getPaymentById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found")));
    }
}
