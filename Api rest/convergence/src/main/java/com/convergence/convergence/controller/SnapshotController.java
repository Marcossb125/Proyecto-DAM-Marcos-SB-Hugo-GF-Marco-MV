package com.convergence.convergence.controller;

import com.convergence.convergence.model.MatchSnapshot;
import com.convergence.convergence.model.Partida;
import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.MatchSnapshotRepository;
import com.convergence.convergence.repository.PartidaRepository;
import com.convergence.convergence.repository.UserRepository;
import com.convergence.convergence.service.MongoSyncService;
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
    private PartidaRepository partidaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoSyncService mongoSyncService;

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

        // Check if snapshot for this match already exists
        Optional<MatchSnapshot> existing = snapshotRepository.findByMatchId(req.matchId);
        MatchSnapshot snapshot;

        if (existing.isPresent()) {
            snapshot = existing.get();
            snapshot.setStateJson(req.stateJson);
            snapshot.setRonda(req.ronda);
        } else {
            snapshot = new MatchSnapshot(req.matchId, req.ronda, req.stateJson);
        }

        snapshotRepository.save(snapshot);

        // Si hay ganador, actualizar la partida en SQL
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

                // Sync partida actualizada a MongoDB
                try {
                    mongoSyncService.syncPartida(partida);
                } catch (Exception e) {
                    System.err.println("[WARN] MongoDB sync partida omitido: " + e.getMessage());
                }
            }
        }

        // Sync snapshot a MongoDB
        try {
            mongoSyncService.syncMatchSnapshot(snapshot);
        } catch (Exception e) {
            System.err.println("[WARN] MongoDB sync snapshot omitido: " + e.getMessage());
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
