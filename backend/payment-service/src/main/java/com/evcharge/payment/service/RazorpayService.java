package com.evcharge.payment.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class RazorpayService {

    @Autowired
    private RazorpayClient razorpayClient;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    public Order createOrder(BigDecimal amount, String currency, String receipt) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        // Razorpay amounts are in paise (1 INR = 100 Paise)
        orderRequest.put("amount", amount.multiply(new BigDecimal(100)).intValue());
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);

        return razorpayClient.orders.create(orderRequest);
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(attributes, razorpaySecret);
        } catch (RazorpayException e) {
            return false;
        }
    }
}
