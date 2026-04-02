package com.evcharge.user.service;

import com.evcharge.user.dto.UserDto;
import com.evcharge.user.entity.User;
import com.evcharge.user.repository.UserRepository;
import com.evcharge.user.exception.ResourceNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC_REGISTERED = "user.registered";
    private static final String TOPIC_UPDATED = "user.updated";
    private static final String TOPIC_DELETED = "user.deleted";

    public UserDto createUser(UserDto userDto) {
        User user = new User();
        BeanUtils.copyProperties(userDto, user);
        User savedUser = repository.save(user);

        kafkaTemplate.send(TOPIC_REGISTERED, savedUser);

        UserDto response = new UserDto();
        BeanUtils.copyProperties(savedUser, response);
        return response;
    }

    @Cacheable(value = "users", key = "#id")
    public UserDto getUserById(Long id) {
        User user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        UserDto response = new UserDto();
        BeanUtils.copyProperties(user, response);
        return response;
    }

    @CachePut(value = "users", key = "#id")
    public UserDto updateUser(Long id, UserDto userDto) {
        User existingUser = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        existingUser.setPhone(userDto.getPhone());
        existingUser.setVehicleInfo(userDto.getVehicleInfo());
        // Add other fields as needed
        User updatedUser = repository.save(existingUser);

        kafkaTemplate.send(TOPIC_UPDATED, updatedUser);

        UserDto response = new UserDto();
        BeanUtils.copyProperties(updatedUser, response);
        return response;
    }

    public UserDto getUserByUsername(String username) {
        User user = repository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        UserDto response = new UserDto();
        BeanUtils.copyProperties(user, response);
        return response;
    }

    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        repository.deleteById(id);
        kafkaTemplate.send(TOPIC_DELETED, id);
    }

    public List<UserDto> getAllUsers() {
        return repository.findAll().stream().map(user -> {
            UserDto dto = new UserDto();
            BeanUtils.copyProperties(user, dto);
            return dto;
        }).collect(Collectors.toList());
    }
}
