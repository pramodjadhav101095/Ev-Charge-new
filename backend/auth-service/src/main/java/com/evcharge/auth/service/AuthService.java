package com.evcharge.auth.service;

import com.evcharge.auth.client.UserClient;
import com.evcharge.auth.dto.UserRegistrationDto;
import com.evcharge.auth.entity.UserCredential;
import com.evcharge.auth.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserCredentialRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserClient userClient;

    public String saveUser(UserCredential credential) {
        credential.setPassword(passwordEncoder.encode(credential.getPassword()));
        repository.save(credential);

        UserRegistrationDto userDto = UserRegistrationDto.builder()
                .username(credential.getName())
                .email(credential.getEmail())
                .roles(credential.getRoles())
                .build();

        userClient.saveUser(userDto); // Call user service to create profile
        return "user added to system";
    }

    public String generateToken(String username) {
        UserCredential user = repository.findByName(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return jwtService.generateToken(username, user.getRoles());
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}
