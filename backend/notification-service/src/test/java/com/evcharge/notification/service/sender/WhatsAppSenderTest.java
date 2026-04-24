package com.evcharge.notification.service.sender;

import com.evcharge.notification.repository.NotificationRepository;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WhatsAppSenderTest {

    @Mock
    private NotificationRepository repository;

    @InjectMocks
    private WhatsAppSender whatsAppSender;

    @BeforeEach
    void setUp() {
        // Set values for @Value fields using ReflectionTestUtils
        ReflectionTestUtils.setField(whatsAppSender, "accountSid", "test_sid");
        ReflectionTestUtils.setField(whatsAppSender, "authToken", "test_token");
        ReflectionTestUtils.setField(whatsAppSender, "twilioNumber", "test_number");
        
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void testSendWhatsApp_Success() {
        // We use MockedStatic to mock the static Message.creator() method of Twilio SDK
        try (MockedStatic<Message> mockedMessage = mockStatic(Message.class)) {
            MessageCreator creator = mock(MessageCreator.class);
            Message mockMessageResult = mock(Message.class);

            // Mock the fluent API chain: Message.creator(...).create()
            mockedMessage.when(() -> Message.creator(
                    any(com.twilio.type.PhoneNumber.class),
                    any(com.twilio.type.PhoneNumber.class),
                    anyString())).thenReturn(creator);
            
            when(creator.create()).thenReturn(mockMessageResult);
            when(mockMessageResult.getSid()).thenReturn("SM12345");

            // Execute the send
            whatsAppSender.send("+911234567890", "Booking Confirmed", "Your slot is ready!");

            // Verify that Twilio's Message.creator() and create() were called once
            mockedMessage.verify(() -> Message.creator(
                    any(com.twilio.type.PhoneNumber.class),
                    any(com.twilio.type.PhoneNumber.class),
                    anyString()), times(1));
            verify(creator, times(1)).create();
            verify(repository, atLeastOnce()).save(any());
        }
    }

    @Test
    void testSendWhatsApp_MockMode() {
        // Clear SID to trigger Mock Mode
        ReflectionTestUtils.setField(whatsAppSender, "accountSid", "");

        // Execute the send
        whatsAppSender.send("+911234567890", "Booking Confirmed", "Your slot is ready!");

        // If in Mock mode, nothing should be called from Twilio
        // No Exception should be thrown either
        verify(repository, times(1)).save(any());
    }
}
