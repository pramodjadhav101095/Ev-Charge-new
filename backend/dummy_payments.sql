USE payment_db;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO payments (booking_id, user_id, amount, currency, status, razorpay_order_id, razorpay_payment_id)
VALUES 
('BK-1001', 1, 500.00, 'INR', 'SUCCESS', 'order_ABC123', 'pay_XYZ789'),
('BK-1002', 2, 750.50, 'INR', 'PENDING', 'order_DEF456', NULL),
('BK-1003', 1, 200.00, 'INR', 'FAILED', 'order_GHI789', NULL),
('BK-1004', 3, 1200.00, 'INR', 'SUCCESS', 'order_JKL012', 'pay_MNO345');
