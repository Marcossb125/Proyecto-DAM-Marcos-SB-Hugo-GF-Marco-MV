package com.convergence.convergence.controller;

import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.UserRepository;
import com.convergence.convergence.model.mongodb.UsuarioMongo;
import com.convergence.convergence.repository.mongodb.UsuarioMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/general")
public class GeneralController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UsuarioMongoRepository usuarioMongoRepository;

    /**
     * DTO para recibir la petición de guardado de general.
     */
    public static class GeneralRequest {
        public String nickname;
        public Long generalId;
    }

    /**
     * Guarda el general seleccionado de un usuario.
     */
    @PutMapping("/guardar")
    public ResponseEntity<?> guardarGeneral(@RequestBody GeneralRequest req) {
        if (req.nickname == null || req.nickname.isEmpty()) {
            return ResponseEntity.badRequest().body("El nickname es obligatorio");
        }
        if (req.generalId == null) {
            return ResponseEntity.badRequest().body("El ID del general es obligatorio");
        }

        Optional<User> userOpt = userRepository.findByNickname(req.nickname);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado: " + req.nickname);
        }

        User user = userOpt.get();
        user.setGeneralId(req.generalId);
        userRepository.save(user);

        return ResponseEntity.ok("General guardado con éxito");
    }

    /*
     * Sync with MongoDB
     * UsuarioMongo mongoUser =
     * usuarioMongoRepository.findById(req.nickname).orElseGet(() -> {
     * UsuarioMongo u = new UsuarioMongo();
     * u.setId(req.nickname);
     * u.setVictorias(0);
     * return u;
     * });
     * mongoUser.setIdGeneral(req.generalId.intValue());
     * usuarioMongoRepository.save(mongoUser);
     * 
     * Map<String, Object> response = new HashMap<>();
     * response.put("nickname", req.nickname);
     * response.put("generalId", req.generalId);
     * 
     * return ResponseEntity.ok(response);
     * }
     */

    /**
     * Obtiene el general de un usuario por su nickname.
     */
    @GetMapping("/{nickname}")
    public ResponseEntity<?> obtenerGeneral(@PathVariable String nickname) {
        Optional<User> userOpt = userRepository.findByNickname(nickname);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado: " + nickname);
        }

        User user = userOpt.get();
        Long generalId = user.getGeneralId();

        Map<String, Object> response = new HashMap<>();
        response.put("nickname", nickname);
        response.put("generalId", generalId);

        return ResponseEntity.ok(response);
    }
}
