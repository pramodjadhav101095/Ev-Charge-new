package com.evcharge.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        logger.info("Incoming request: {} {}", exchange.getRequest().getMethod(), exchange.getRequest().getPath());

        exchange.getRequest().getHeaders().forEach((name, values) -> {
            if (name.startsWith("X-User")) {
                logger.info("Security Header: {} = {}", name, values);
            }
        });

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            logger.info("Outgoing response: {} for {} {}",
                    exchange.getResponse().getStatusCode(),
                    exchange.getRequest().getMethod(),
                    exchange.getRequest().getPath());
        }));
    }

    @Override
    public int getOrder() {
        return -1; // Low order to run early
    }
}
