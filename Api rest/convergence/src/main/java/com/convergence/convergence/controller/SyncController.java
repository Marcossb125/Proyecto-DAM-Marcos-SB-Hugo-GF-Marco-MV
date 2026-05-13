package com.convergence.convergence.controller;

import com.convergence.convergence.service.MongoSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoint para ejecutar el volcado de sincronización SQL → MongoDB.
 * Permite sincronizar todas las tablas de golpe o individualmente.
 */
@RestController
@RequestMapping("/sync")
public class SyncController {

    @Autowired
    private MongoSyncService mongoSyncService;

    /**
     * Volcado completo: sincroniza usuarios, partidas y match_snapshots.
     * GET /sync/all
     */
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

    /**
     * Sincroniza solo la tabla de usuarios.
     * GET /sync/usuarios
     */
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

    /**
     * Sincroniza solo la tabla de partidas.
     * GET /sync/partidas
     */
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

    /**
     * Sincroniza solo la tabla de match_snapshots.
     * GET /sync/snapshots
     */
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
