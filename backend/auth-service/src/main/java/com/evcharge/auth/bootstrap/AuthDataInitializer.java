package com.evcharge.auth.bootstrap;

import com.evcharge.auth.entity.UserCredential;
import com.evcharge.auth.repository.UserCredentialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthDataInitializer implements CommandLineRunner {

    private final UserCredentialRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            log.info("Populating dummy user credentials...");

            List<UserCredential> users = Arrays.asList(
                    new UserCredential(0, "admin", "admin@evcharge.com", passwordEncoder.encode("admin"), "ADMIN"),
                    new UserCredential(0, "user1", "user@evcharge.com", passwordEncoder.encode("password"), "USER"));

            repository.saveAll(users);
            log.info("Added {} dummy user credentials.", users.size());
        } else {
            log.info("User credentials already exist, skipping initialization.");
        }
    }
}
