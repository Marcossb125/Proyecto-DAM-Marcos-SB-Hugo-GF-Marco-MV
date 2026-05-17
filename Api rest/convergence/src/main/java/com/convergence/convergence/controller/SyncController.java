package com.convergence.convergence.controller;

import com.convergence.convergence.service.MongoSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/sync")
public class SyncController {

    @Autowired
    private MongoSyncService mongoSyncService;

    @GetMapping("/all")
    public ResponseEntity<?> syncAll() {
        try {
            MongoSyncService.SyncResult result = mongoSyncService.syncAll();
            return ResponseEntity.ok(Map.of(
                "mensaje", "Volcado SQL → MongoDB completado",
                "usuarios_sincronizados", result.usuariosSincronizados,
                "partidas_sincronizadas", result.partidasSincronizadas,
                "snapshots_sincronizados", result.snapshotsSincronizados
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error durante la sincronización",
                "detalle", e.getMessage()
            ));
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> syncUsuarios() {
        try {
            int count = mongoSyncService.syncAllUsuarios();
            return ResponseEntity.ok(Map.of(
                "mensaje", "Usuarios sincronizados",
                "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/partidas")
    public ResponseEntity<?> syncPartidas() {
        try {
            int count = mongoSyncService.syncAllPartidas();
            return ResponseEntity.ok(Map.of(
                "mensaje", "Partidas sincronizadas",
                "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/snapshots")
    public ResponseEntity<?> syncSnapshots() {
        try {
            int count = mongoSyncService.syncAllMatchSnapshots();
            return ResponseEntity.ok(Map.of(
                "mensaje", "Snapshots sincronizados",
                "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
