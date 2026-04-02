package com.evcharge.gateway.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/fallback")
public class FallbackController {
    @RequestMapping(value = "/auth", method = { RequestMethod.GET, RequestMethod.POST })
    public Mono<String> authServiceFallback() {
        return Mono.just(
                "Auth Service is taking too long to respond or is down. Please try again later.");
    }

    @RequestMapping(value = "/user", method = { RequestMethod.GET, RequestMethod.POST })
    public Mono<String> userServiceFallback() {
        return Mono.just(
                "User Service is taking too long to respond or is down. Please try again later.");
    }

    @RequestMapping(value = "/station", method = { RequestMethod.GET, RequestMethod.POST })
    public Mono<String> stationServiceFallback() {
        return Mono.just(
                "Station Service is taking too long to respond or is down. Please try again later.");
    }
}
