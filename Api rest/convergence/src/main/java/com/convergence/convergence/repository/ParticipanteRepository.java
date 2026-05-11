package com.convergence.convergence.repository;

import com.convergence.convergence.model.Participante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    List<Participante> findByUsuarioId(Long usuarioId);
    List<Participante> findByPartidaId(Long partidaId);
    Optional<Participante> findByPartidaIdAndUsuarioId(Long partidaId, Long usuarioId);
    long countByUsuarioId(Long usuarioId);
    void deleteByPartidaId(Long partidaId);
}
