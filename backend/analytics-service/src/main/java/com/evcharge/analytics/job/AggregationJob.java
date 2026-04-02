package com.evcharge.analytics.job;

import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AggregationJob implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("Executing scheduled analytics aggregation job...");
        // Logic to pull data from other services and save to AnalyticsMetric
    }
}
