package com.convergence.convergence.controller;

import com.convergence.convergence.model.MatchSnapshot;
import com.convergence.convergence.model.Partida;
import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.MatchSnapshotRepository;
import com.convergence.convergence.repository.PartidaRepository;
import com.convergence.convergence.repository.UserRepository;
import com.convergence.convergence.model.mongodb.PartidaMongo;
import com.convergence.convergence.model.mongodb.UsuarioMongo;
import com.convergence.convergence.repository.mongodb.PartidaMongoRepository;
import com.convergence.convergence.repository.mongodb.UsuarioMongoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/snapshots")
public class SnapshotController {

    @Autowired
    private MatchSnapshotRepository snapshotRepository;

    @Autowired
    private PartidaMongoRepository partidaMongoRepository;

    @Autowired
    private UsuarioMongoRepository usuarioMongoRepository;

    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static class SaveSnapshotRequest {
        public Long matchId;
        public int ronda;
        public String stateJson;
        public String idHost;
        public String idGanador;
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarSnapshot(@RequestBody SaveSnapshotRequest req) {
        if (req.matchId == null || req.stateJson == null) {
            return ResponseEntity.badRequest().body("matchId y stateJson son obligatorios");
        }

        // Check if snapshot for this round already exists
        Optional<MatchSnapshot> existing = snapshotRepository.findByMatchIdAndRonda(req.matchId, req.ronda);
        MatchSnapshot snapshot;

        if (existing.isPresent()) {
            snapshot = existing.get();
            snapshot.setStateJson(req.stateJson);
        } else {
            snapshot = new MatchSnapshot(req.matchId, req.ronda, req.stateJson);
        }

        snapshotRepository.save(snapshot);
        if (req.idGanador != null && !req.idGanador.isBlank()) {
            Optional<Partida> partidaOpt = partidaRepository.findById(req.matchId);
            if (partidaOpt.isPresent()) {
                Partida partida = partidaOpt.get();
                Optional<User> winnerOpt = userRepository.findByNickname(req.idGanador);
                if (winnerOpt.isPresent()) {
                    partida.setIdGanador(winnerOpt.get().getId());
                }
                partida.setEstado("Finalizada");
                partidaRepository.save(partida);
            }
        }

        // --- Sincronización con MongoDB ---
        try {
            PartidaMongo mongoPartida = new PartidaMongo();
            mongoPartida.setId(req.matchId.toString());
            mongoPartida.setIdHost(req.idHost);
            mongoPartida.setIdGanador(req.idGanador);

            // Parsear el estado JSON a objeto para MongoDB
            if (req.stateJson != null) {
                Object stateObj = objectMapper.readValue(req.stateJson, Object.class);
                mongoPartida.setSnapshot(stateObj);
            }

            partidaMongoRepository.save(mongoPartida);

            // Actualizar victorias si hay un ganador
            if (req.idGanador != null && !req.idGanador.isEmpty()) {
                UsuarioMongo mongoUser = usuarioMongoRepository.findById(req.idGanador).orElseGet(() -> {
                    UsuarioMongo u = new UsuarioMongo();
                    u.setId(req.idGanador);
                    u.setIdGeneral(0);
                    u.setVictorias(0);
                    return u;
                });
                mongoUser.setVictorias((mongoUser.getVictorias() != null ? mongoUser.getVictorias() : 0) + 1);
                usuarioMongoRepository.save(mongoUser);
            }
        } catch (Exception e) {
            System.err.println("[WARN] Fallo al sincronizar con MongoDB en SnapshotController: " + e.getMessage());
        }

        return ResponseEntity.ok("Snapshot guardado con éxito");
    }

    @GetMapping("/match/{matchId}/ronda/{ronda}")
    public ResponseEntity<?> obtenerSnapshot(@PathVariable Long matchId, @PathVariable int ronda) {
        Optional<MatchSnapshot> snapshot = snapshotRepository.findByMatchIdAndRonda(matchId, ronda);
        if (snapshot.isEmpty()) {
            return ResponseEntity.status(404).body("Snapshot no encontrado");
        }
        return ResponseEntity.ok(snapshot.get());
    }

    @GetMapping("/match/{matchId}/latest")
    public ResponseEntity<?> obtenerUltimoSnapshot(@PathVariable Long matchId) {
        Optional<MatchSnapshot> snapshot = snapshotRepository.findTopByMatchIdOrderByRondaDesc(matchId);
        if (snapshot.isEmpty()) {
            return ResponseEntity.status(404).body("Snapshot no encontrado");
        }
        return ResponseEntity.ok(snapshot.get());
    }
}
