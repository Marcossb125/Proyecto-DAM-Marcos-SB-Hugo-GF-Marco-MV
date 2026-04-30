package com.convergence.convergence.controller;

import com.convergence.convergence.model.Partida;
import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.PartidaRepository;
import com.convergence.convergence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/partidas")
public class PartidaController {

    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private UserRepository userRepository;

    public static class PartidaRequest {
        public String nombre;
        public int jugadores_limite;
        public String hostNombre;
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearPartida(@RequestBody PartidaRequest req) {
        if (req.nombre == null || req.nombre.isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre de la partida es obligatorio");
        }
        
        Optional<Partida> existing = partidaRepository.findByNombre(req.nombre);
        if (existing.isPresent()) {
            return ResponseEntity.status(409).body("Ya existe una partida con ese nombre");
        }

        // Buscar el usuario host por su nickname
        Optional<User> hostUser = userRepository.findByNickname(req.hostNombre);
        if (hostUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el usuario host con el nickname: " + req.hostNombre);
        }

        Partida nuevaPartida = new Partida();
        nuevaPartida.setNombre(req.nombre);
        nuevaPartida.setJugadoresLimite(req.jugadores_limite);
        nuevaPartida.setHostId(hostUser.get().getId());
        
        Partida guardada = partidaRepository.save(nuevaPartida);
        return ResponseEntity.ok(guardada);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPartidaPorId(@PathVariable Long id) {
        Optional<Partida> partida = partidaRepository.findById(id);
        if (partida.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontró partida con ID: " + id);
        }
        return ResponseEntity.ok(partida.get());
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> obtenerPartidaPorNombre(@PathVariable String nombre) {
        Optional<Partida> partida = partidaRepository.findByNombre(nombre);
        if (partida.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontró partida con nombre: " + nombre);
        }
        Partida p = partida.get();
        userRepository.findById(p.getHostId()).ifPresent(u -> p.setHostNombre(u.getNickname()));
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> borrarPartida(@PathVariable Long id, @RequestParam String requester) {
        Optional<Partida> partidaOpt = partidaRepository.findById(id);
        if (partidaOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Partida no encontrada");
        }
        
        Partida partida = partidaOpt.get();
        Optional<User> userOpt = userRepository.findByNickname(requester);
        
        if (userOpt.isEmpty() || !userOpt.get().getId().equals(partida.getHostId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo el host de la partida puede borrarla");
        }

        partidaRepository.deleteById(id);
        return ResponseEntity.ok("Partida borrada con éxito");
    }

    @GetMapping("/buscar/activas")
    public ResponseEntity<List<Partida>> obtenerPartidasEnCurso() {
        List<Partida> partidas = partidaRepository.findByEstado("En curso");
        for (Partida p : partidas) {
            userRepository.findById(p.getHostId()).ifPresent(u -> p.setHostNombre(u.getNickname()));
        }
        return ResponseEntity.ok(partidas);
    }
}
