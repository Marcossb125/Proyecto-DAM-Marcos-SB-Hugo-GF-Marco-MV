package com.convergence.convergence.controller;

import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.UserRepository;
import com.convergence.convergence.service.MongoSyncService;
import com.convergence.convergence.model.mongodb.UsuarioMongo;
import com.convergence.convergence.repository.mongodb.UsuarioMongoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UsuarioMongoRepository usuarioMongoRepository;

    @Autowired
    private MongoSyncService mongoSyncService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${backend.auth.username}")
    private String backendUser;

    @Value("${backend.auth.password}")
    private String backendPassword;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public static class AuthRequest {
        public String nickname;
        public String password;
        public String email;
    }

    private void syncUserWithMongo(String nickname, Long generalId) {
        try {
            if (!usuarioMongoRepository.existsById(nickname)) {
                UsuarioMongo mongoUser = new UsuarioMongo();
                mongoUser.setId(nickname);
                mongoUser.setIdGeneral(generalId != null ? generalId.intValue() : 0);
                mongoUser.setVictorias(0);
                usuarioMongoRepository.save(mongoUser);
                logger.info("Usuario {} sincronizado con MongoDB", nickname);
            }
        } catch (Exception e) {
            logger.warn("No se pudo sincronizar el usuario {} con MongoDB: {}", nickname, e.getMessage());
        }
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

        try {
            mongoSyncService.syncUsuario(u);
        } catch (Exception e) {
            System.err.println("[WARN] MongoDB sync omitido en register: " + e.getMessage());
        }

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

        try {
            mongoSyncService.syncUsuario(user.get());
        } catch (Exception e) {
            System.err.println("[WARN] MongoDB sync omitido en login: " + e.getMessage());
        }

        return ResponseEntity.ok(req.nickname);
    }

    @PostMapping("/backend-login")
    public ResponseEntity<?> backendLogin(@RequestBody AuthRequest req) {
        if (req.nickname == null || req.password == null) {
            return ResponseEntity.badRequest().body("nickname and password required");
        }

        if (!req.nickname.equals(backendUser) || !req.password.equals(backendPassword)) {
            return ResponseEntity.status(401).body("invalid backend credentials");
        }

        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 60 * 60 * 1000L); // 1 hora
        String jwtGen = Jwts.builder()
                .setSubject(req.nickname)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(getSecretKey())
                .compact();

        return ResponseEntity.ok(Map.of("token", jwtGen));
    }
}
