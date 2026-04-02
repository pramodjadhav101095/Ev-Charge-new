package com.evcharge.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {

    @PostMapping("/users")
    void saveUser(@RequestBody Object userDto); // Define DTO properly later, using Object for now to avoid dependency issues
}
