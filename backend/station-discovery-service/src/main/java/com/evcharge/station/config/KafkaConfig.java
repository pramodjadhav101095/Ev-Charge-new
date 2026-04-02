package com.evcharge.station.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic stationCreatedTopic() {
        return TopicBuilder.name("station.created").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic stationUpdatedTopic() {
        return TopicBuilder.name("station.updated").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic stationStatusChangedTopic() {
        return TopicBuilder.name("station.status_changed").partitions(3).replicas(1).build();
    }
}
