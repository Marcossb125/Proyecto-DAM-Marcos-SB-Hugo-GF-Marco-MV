package com.convergence.convergence.controller;

import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Generate a secret key for signing JWTs. This key is generated at application
    // startup; to keep tokens valid across restarts you should persist or
    // configure a fixed key (e.g. from environment variable).
    private final SecretKey SECRET_KEY = Jwts.SIG.HS256.key().build();

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
        String hashed = passwordEncoder.encode(req.password);
        User u = new User(req.nickname, hashed, req.email);
        userRepository.save(u);
        // Do not return the password to the client
        u.setPassword(null);
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
        if (!passwordEncoder.matches(req.password, user.get().getPassword())) {
            return ResponseEntity.status(401).body("invalid credentials");
        }
    Date issuedAt = new Date();
    String jwtGen = Jwts.builder()
        .setSubject(user.get().getNickname())
        .setIssuedAt(issuedAt)
        .signWith(SECRET_KEY)
        .compact();
    // In a real app return a token (JWT) instead of the user
    return ResponseEntity.ok(req.nickname);
    }
}
