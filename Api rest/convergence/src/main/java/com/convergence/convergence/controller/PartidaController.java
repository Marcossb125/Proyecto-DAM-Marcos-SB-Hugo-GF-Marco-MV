package com.convergence.convergence.controller;

import com.convergence.convergence.model.Partida;
import com.convergence.convergence.repository.PartidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/partidas")
public class PartidaController {

    @Autowired
    private PartidaRepository partidaRepository;

    @PostMapping("/crear")
    public ResponseEntity<?> crearPartida(@RequestBody Partida partida) {
        if (partida.getNombre() == null || partida.getNombre().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre de la partida es obligatorio");
        }
        
        Optional<Partida> existing = partidaRepository.findByNombre(partida.getNombre());
        if (existing.isPresent()) {
            return ResponseEntity.status(409).body("Ya existe una partida con ese nombre");
        }

        Partida nuevaPartida = partidaRepository.save(partida);
        return ResponseEntity.ok(nuevaPartida);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPartidaPorId(@PathVariable Long id) {
        Optional<Partida> partida = partidaRepository.findByHost_id(id);
        return ResponseEntity.ok(partida.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> borrarPartida(@PathVariable Long id) {
        if (!partidaRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Partida no encontrada");
        }
        partidaRepository.deleteById(id);
        return ResponseEntity.ok("Partida borrada con éxito");
    }

    @GetMapping("/activas")
    public ResponseEntity<List<Partida>> obtenerPartidasEnCurso() {
        List<Partida> partidas = partidaRepository.findByEstado("en curso");
        return ResponseEntity.ok(partidas);
    }
}
