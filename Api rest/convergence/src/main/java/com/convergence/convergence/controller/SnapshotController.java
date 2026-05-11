package com.convergence.convergence.controller;

import com.convergence.convergence.model.MatchSnapshot;
import com.convergence.convergence.repository.MatchSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/snapshots")
public class SnapshotController {

    @Autowired
    private MatchSnapshotRepository snapshotRepository;

    public static class SaveSnapshotRequest {
        public Long matchId;
        public int ronda;
        public String stateJson;
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
