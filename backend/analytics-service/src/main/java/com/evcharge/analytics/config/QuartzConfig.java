package com.evcharge.analytics.config;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail aggregationJobDetail() {
        return JobBuilder.newJob(com.evcharge.analytics.job.AggregationJob.class)
                .withIdentity("aggregationJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger aggregationJobTrigger() {
        return TriggerBuilder.newTrigger()
                .forJob(aggregationJobDetail())
                .withIdentity("aggregationTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 * * * ?")) // Every hour
                .build();
    }
}
