package com.convergence.convergence.repository;

import com.convergence.convergence.model.MatchSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MatchSnapshotRepository extends JpaRepository<MatchSnapshot, Long> {
    Optional<MatchSnapshot> findByMatchIdAndRonda(Long matchId, int ronda);
    Optional<MatchSnapshot> findTopByMatchIdOrderByRondaDesc(Long matchId);
    Optional<MatchSnapshot> findByMatchId(Long matchId);
}
