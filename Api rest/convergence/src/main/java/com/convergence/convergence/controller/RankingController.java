package com.convergence.convergence.controller;

import com.convergence.convergence.model.mongodb.UsuarioMongo;
import com.convergence.convergence.repository.mongodb.UsuarioMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    @Autowired
    private UsuarioMongoRepository usuarioMongoRepository;

    @GetMapping
    public List<UsuarioMongo> getRanking() {
        return usuarioMongoRepository.findByOrderByVictoriasDesc();
    }

    @GetMapping("/top-jugador")
    public ResponseEntity<?> getTopJugador() {
        Optional<UsuarioMongo> top = usuarioMongoRepository.findTopByOrderByVictoriasDesc();
        if (top.isEmpty()) {
            return ResponseEntity.status(404).body("No hay usuarios registrados");
        }
        return ResponseEntity.ok(top.get());
    }

    // Suma victorias de todos los usuarios agrupadas por generalId y devuelve el top
    @GetMapping("/top-general")
    public ResponseEntity<?> getTopGeneral() {
        List<UsuarioMongo> todos = usuarioMongoRepository.findAll();

        Map<Integer, Long> victoriasPorGeneral = new HashMap<>();
        for (UsuarioMongo u : todos) {
            if (u.getIdGeneral() != null && u.getIdGeneral() > 0) {
                int gid = u.getIdGeneral();
                long vic = u.getVictorias() != null ? u.getVictorias() : 0;
                victoriasPorGeneral.merge(gid, vic, Long::sum);
            }
        }

        if (victoriasPorGeneral.isEmpty()) {
            return ResponseEntity.status(404).body("No hay datos de generales");
        }

        Map.Entry<Integer, Long> topEntry = victoriasPorGeneral.entrySet()
                .stream()
                .max(Comparator.comparingLong(Map.Entry::getValue))
                .orElseThrow();

        Map<String, Object> result = new HashMap<>();
        result.put("generalId", topEntry.getKey());
        result.put("victorias", topEntry.getValue());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/general/{id}")
    public Long getGeneralStats(@PathVariable Integer id) {
        List<UsuarioMongo> usersWithGeneral = usuarioMongoRepository.findByIdGeneral(id);
        return usersWithGeneral.stream()
                .mapToLong(u -> u.getVictorias() != null ? u.getVictorias() : 0)
                .sum();
    }

    @GetMapping("/user/{nickname}")
    public UsuarioMongo getUserProfile(@PathVariable String nickname) {
        return usuarioMongoRepository.findById(nickname).orElse(null);
    }
}
