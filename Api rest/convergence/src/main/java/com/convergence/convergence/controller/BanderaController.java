package com.convergence.convergence.controller;

import com.convergence.convergence.model.Bandera;
import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/bandera")
public class BanderaController {

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * DTO para recibir la petición de guardado de bandera.
     * Contiene el nickname del usuario y el objeto bandera con layout, nombre y colores.
     */
    public static class BanderaRequest {
        public String nickname;
        public Bandera bandera;
    }

    /**
     * Guarda la bandera de un usuario.
     * Recibe el nickname y el objeto bandera (layout, nombre, colors).
     */
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
            String banderaJson = objectMapper.writeValueAsString(req.bandera);
            user.setBandera(banderaJson);
            userRepository.save(user);
            return ResponseEntity.ok(req.bandera);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Error al serializar la bandera");
        }
    }

    /**
     * Obtiene la bandera de un usuario por su nickname.
     */
    @GetMapping("/{nickname}")
    public ResponseEntity<?> obtenerBandera(@PathVariable String nickname) {
        Optional<User> userOpt = userRepository.findByNickname(nickname);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado: " + nickname);
        }

        String banderaJson = userOpt.get().getBandera();
        if (banderaJson == null || banderaJson.isEmpty()) {
            return ResponseEntity.ok(null);
        }

        try {
            Bandera bandera = objectMapper.readValue(banderaJson, Bandera.class);
            return ResponseEntity.ok(bandera);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Error al deserializar la bandera");
        }
    }
}
