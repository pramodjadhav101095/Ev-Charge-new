package com.evcharge.user.bootstrap;

import com.evcharge.user.entity.User;
import com.evcharge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Populating dummy user profiles...");

            List<User> users = Arrays.asList(
                    new User(null, "admin", "admin@evcharge.com", "9876543210", "ADMIN", "Tesla Model 3"),
                    new User(null, "user1", "user@evcharge.com", "9876543211", "USER", "Hyundai Kona Electric"),
                    new User(null, "user2", "user2@evcharge.com", "9876543212", "USER", "Tata Nexon EV"));

            userRepository.saveAll(users);
            log.info("Added {} dummy user profiles.", users.size());
        } else {
            log.info("User profiles already exist, skipping initialization.");
        }
    }
}
