package com.convergence.convergence.controller;

import com.convergence.convergence.model.Partida;
import com.convergence.convergence.model.User;
import com.convergence.convergence.model.Participante;
import com.convergence.convergence.repository.PartidaRepository;
import com.convergence.convergence.repository.UserRepository;
import com.convergence.convergence.repository.ParticipanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.transaction.Transactional;
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

    @Autowired
    private ParticipanteRepository participanteRepository;

    public static class PartidaRequest {
        public String nombre;
        public int jugadores_limite;
        public String hostNombre;
    }

    @PostMapping("/crear")
    @Transactional
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

        User user = hostUser.get();

        // Verificar el límite de 3 partidas
        long count = participanteRepository.countByUsuarioId(user.getId());
        if (count >= 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya has alcanzado el límite de 3 partidas activas");
        }

        Partida nuevaPartida = new Partida();
        nuevaPartida.setNombre(req.nombre);
        nuevaPartida.setJugadoresLimite(req.jugadores_limite);
        nuevaPartida.setHostId(user.getId());
        
        Partida guardada = partidaRepository.save(nuevaPartida);

        // Añadir al host como participante
        Participante participante = new Participante(guardada.getId(), user.getId());
        participanteRepository.save(participante);

        return ResponseEntity.ok(guardada);
    }

    @PostMapping("/{id}/unirse")
    @Transactional
    public ResponseEntity<?> unirseAPartida(@PathVariable Long id, @RequestParam String nickname) {
        Optional<Partida> partidaOpt = partidaRepository.findById(id);
        if (partidaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada");
        }

        Partida partida = partidaOpt.get();
        if (partida.getJugadoresActuales() >= partida.getJugadoresLimite()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La partida está llena");
        }

        Optional<User> userOpt = userRepository.findByNickname(nickname);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        User user = userOpt.get();

        // Verificar si ya está en la partida
        Optional<Participante> existing = participanteRepository.findByPartidaIdAndUsuarioId(id, user.getId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(partida); // Ya está dentro
        }

        // Verificar el límite de 3 partidas
        long count = participanteRepository.countByUsuarioId(user.getId());
        if (count >= 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya has alcanzado el límite de 3 partidas activas");
        }

        // Añadir participante
        Participante participante = new Participante(id, user.getId());
        participanteRepository.save(participante);

        // Actualizar contador de la partida
        partida.setJugadoresActuales(partida.getJugadoresActuales() + 1);
        partidaRepository.save(partida);

        return ResponseEntity.ok(partida);
    }

    @GetMapping("/usuario/{nickname}")
    public ResponseEntity<?> obtenerPartidasUsuario(@PathVariable String nickname) {
        Optional<User> userOpt = userRepository.findByNickname(nickname);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        List<Participante> participaciones = participanteRepository.findByUsuarioId(userOpt.get().getId());
        List<Long> ids = participaciones.stream().map(p -> p.getPartidaId()).toList();
        List<Partida> partidas = partidaRepository.findAllById(ids);
        
        for (Partida p : partidas) {
            userRepository.findById(p.getHostId()).ifPresent(u -> p.setHostNombre(u.getNickname()));
        }

        return ResponseEntity.ok(partidas);
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

    @Transactional
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

        participanteRepository.deleteByPartidaId(id);
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
