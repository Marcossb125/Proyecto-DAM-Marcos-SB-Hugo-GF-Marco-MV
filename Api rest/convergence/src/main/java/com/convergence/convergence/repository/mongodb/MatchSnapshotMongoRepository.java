package com.convergence.convergence.repository.mongodb;

import com.convergence.convergence.model.mongodb.MatchSnapshotMongo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MatchSnapshotMongoRepository extends MongoRepository<MatchSnapshotMongo, String> {
    List<MatchSnapshotMongo> findByMatchId(Long matchId);
    Optional<MatchSnapshotMongo> findByMatchIdAndRonda(Long matchId, Integer ronda);
}
