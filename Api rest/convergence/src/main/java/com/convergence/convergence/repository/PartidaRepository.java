package com.convergence.convergence.repository;

import com.convergence.convergence.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Long> {
    Optional<Partida> findByNombre(String nombre);
    List<Partida> findByEstado(String estado);
    
    @Query("SELECT p FROM Partida p WHERE p.hostId = :hostId")
    Optional<Partida> findByHostId(@Param("hostId") Long hostId);
}
