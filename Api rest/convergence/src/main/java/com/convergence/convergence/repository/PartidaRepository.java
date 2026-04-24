package com.convergence.convergence.repository;

import com.convergence.convergence.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Long> {
    Optional<Partida> findByNombre(String nombre);
    List<Partida> findByEstado(String estado);
    Optional<Partida> findByHost_id(Long host_id);
}
