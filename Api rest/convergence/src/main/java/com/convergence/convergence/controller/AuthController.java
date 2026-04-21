package com.convergence.convergence.controller;

import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    public static class AuthRequest {
        public String nickname;
        public String password;
        public String email;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (req.nickname == null || req.password == null || req.email == null) {
            return ResponseEntity.badRequest().body("nickname and password required");
        }
        Optional<User> existing = userRepository.findByNickname(req.nickname);
        Optional<User> existingEmail = userRepository.findByEmail(req.email);
        if (existing.isPresent() || existingEmail.isPresent()) {
            return ResponseEntity.status(409).body("user exists");
        }
        User u = new User(req.nickname, req.password, req.email);
        userRepository.save(u);
        return ResponseEntity.ok(u);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        if (req.nickname == null || req.password == null) {
            return ResponseEntity.badRequest().body("nickname and password required");
        }
        Optional<User> user = userRepository.findByNickname(req.nickname);
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("user not found");
        }
        if (!user.get().getPassword().equals(req.password)) {
            return ResponseEntity.status(401).body("invalid credentials");
        }
        // In a real app return a token (JWT) instead of the user
        return ResponseEntity.ok(user.get());
    }
}
