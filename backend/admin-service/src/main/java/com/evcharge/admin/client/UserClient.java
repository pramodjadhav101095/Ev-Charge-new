package com.evcharge.admin.client;

import com.evcharge.admin.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users")
    List<UserResponse> getAllUsers();

    @PutMapping("/users/{id}/role")
    void updateUserRole(@PathVariable("id") Long id, @RequestParam("role") String role);

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable("id") Long id);
}
