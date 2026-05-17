package com.convergence.convergence.controller;

import com.convergence.convergence.model.Bandera;
import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/bandera")
public class BanderaController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.convergence.convergence.service.MongoSyncService mongoSyncService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static class BanderaRequest {
        public String nickname;
        public String nombre;
        public Bandera bandera;
    }

    @PutMapping("/guardar")
    public ResponseEntity<?> guardarBandera(@RequestBody BanderaRequest req) {
        if (req.nickname == null || req.nickname.isEmpty()) {
            return ResponseEntity.badRequest().body("El nickname es obligatorio");
        }
        if (req.bandera == null) {
            return ResponseEntity.badRequest().body("Los datos de la bandera son obligatorios");
        }

        Optional<User> userOpt = userRepository.findByNickname(req.nickname);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado: " + req.nickname);
        }

        try {
            User user = userOpt.get();
            // Guardamos el nombre de la facción en el campo independiente
            user.setFaccion(req.nombre);
            
            // Guardamos el diseño de la bandera en el JSON
            String banderaJson = objectMapper.writeValueAsString(req.bandera);
            user.setBandera(banderaJson);
            
            userRepository.save(user);
            
            // --- Sincronización con MongoDB ---
            try {
                mongoSyncService.syncUsuario(user);
            } catch (Exception e) {
                System.err.println("[WARN] No se pudo sincronizar la bandera con MongoDB: " + e.getMessage());
            }
            
            // Devolvemos la estructura completa para confirmación
            Map<String, Object> response = new HashMap<>();
            response.put("layout", req.bandera.getLayout());
            response.put("colors", req.bandera.getColors());
            response.put("nombre", req.nombre);
            
            return ResponseEntity.ok(response);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Error al serializar la bandera");
        }
    }

    @GetMapping("/{nickname}")
    public ResponseEntity<?> obtenerBandera(@PathVariable String nickname) {
        Optional<User> userOpt = userRepository.findByNickname(nickname);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado: " + nickname);
        }

        User user = userOpt.get();
        String banderaJson = user.getBandera();
        String faccion = user.getFaccion();

        if (banderaJson == null || banderaJson.isEmpty()) {
            return ResponseEntity.ok(null);
        }

        try {
            Bandera bandera = objectMapper.readValue(banderaJson, Bandera.class);
            
            Map<String, Object> response = new HashMap<>();
            response.put("layout", bandera.getLayout());
            response.put("colors", bandera.getColors());
            response.put("nombre", faccion);
            
            return ResponseEntity.ok(response);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Error al deserializar la bandera");
        }
    }
}
