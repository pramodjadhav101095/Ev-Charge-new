package com.evcharge.session.controller;

import com.evcharge.session.dto.SessionDto;
import com.evcharge.session.dto.SessionStartRequest;
import com.evcharge.session.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/start")
    public ResponseEntity<SessionDto> startSession(@RequestBody SessionStartRequest request) {
        return ResponseEntity.ok(sessionService.startSession(request.getBookingId()));
    }

    @GetMapping("/active/user/{userId}")
    public ResponseEntity<List<SessionDto>> getActiveSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getActiveSessionsByUser(userId));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<SessionDto> endSession(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.endSession(id));
    }
}
