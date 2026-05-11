package com.convergence.convergence.repository.mongodb;

import com.convergence.convergence.model.mongodb.PartidaMongo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PartidaMongoRepository extends MongoRepository<PartidaMongo, String> {
}
