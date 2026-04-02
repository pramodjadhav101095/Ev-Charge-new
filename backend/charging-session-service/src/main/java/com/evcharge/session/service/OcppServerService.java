package com.evcharge.session.service;

import eu.chargetime.ocpp.JSONServer;
import eu.chargetime.ocpp.ServerEvents;
import eu.chargetime.ocpp.feature.profile.ServerCoreProfile;
import eu.chargetime.ocpp.model.SessionInformation;
import eu.chargetime.ocpp.model.core.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import eu.chargetime.ocpp.feature.profile.ServerCoreEventHandler;
import jakarta.annotation.PostConstruct;
import java.time.ZonedDateTime;
import java.util.UUID;

@Service
@Slf4j
public class OcppServerService {

    private JSONServer server;

    @Value("${ocpp.server.port:8887}")
    private int port;

    @PostConstruct
    public void init() {
        ServerCoreProfile coreProfile = new ServerCoreProfile(new ServerCoreEventHandler() {
            @Override
            public AuthorizeConfirmation handleAuthorizeRequest(UUID sessionIndex, AuthorizeRequest request) {
                log.info("AuthorizeRequest: {}", request.getIdTag());
                return new AuthorizeConfirmation(new IdTagInfo(AuthorizationStatus.Accepted));
            }

            @Override
            public BootNotificationConfirmation handleBootNotificationRequest(UUID sessionIndex,
                    BootNotificationRequest request) {
                log.info("BootNotificationRequest from : {}", request.getChargePointModel());
                return new BootNotificationConfirmation(ZonedDateTime.now(), 300, RegistrationStatus.Accepted);
            }

            @Override
            public HeartbeatConfirmation handleHeartbeatRequest(UUID sessionIndex, HeartbeatRequest request) {
                return new HeartbeatConfirmation(ZonedDateTime.now());
            }

            @Override
            public StartTransactionConfirmation handleStartTransactionRequest(UUID sessionIndex,
                    StartTransactionRequest request) {
                log.info("StartTransactionRequest: tag={}, connector={}", request.getIdTag(), request.getConnectorId());
                return new StartTransactionConfirmation(new IdTagInfo(AuthorizationStatus.Accepted), 12345);
            }

            @Override
            public StatusNotificationConfirmation handleStatusNotificationRequest(UUID sessionIndex,
                    StatusNotificationRequest request) {
                log.info("StatusNotification: connectorId={}, status={}", request.getConnectorId(),
                        request.getStatus());
                return new StatusNotificationConfirmation();
            }

            @Override
            public StopTransactionConfirmation handleStopTransactionRequest(UUID sessionIndex,
                    StopTransactionRequest request) {
                log.info("StopTransactionRequest: transactionId={}, meterStop={}", request.getTransactionId(),
                        request.getMeterStop());
                return new StopTransactionConfirmation();
            }

            @Override
            public DataTransferConfirmation handleDataTransferRequest(UUID sessionIndex, DataTransferRequest request) {
                return new DataTransferConfirmation(DataTransferStatus.Accepted);
            }

            @Override
            public MeterValuesConfirmation handleMeterValuesRequest(UUID sessionIndex, MeterValuesRequest request) {
                return new MeterValuesConfirmation();
            }
        });

        server = new JSONServer(coreProfile);
        server.open("0.0.0.0", port, new ServerEvents() {
            @Override
            public void newSession(UUID sessionIndex, SessionInformation information) {
                log.info("New OCPP session: {}", information.getIdentifier());
            }

            @Override
            public void lostSession(UUID sessionIndex) {
                log.info("OCPP session lost: {}", sessionIndex);
            }
        });
        log.info("OCPP JSON Server started on port {}", port);
    }
}
