package com.convergence.convergence.repository.mongodb;

import com.convergence.convergence.model.mongodb.UsuarioMongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioMongoRepository extends MongoRepository<UsuarioMongo, String> {
    List<UsuarioMongo> findByOrderByVictoriasDesc();

    Optional<UsuarioMongo> findTopByOrderByVictoriasDesc();

    List<UsuarioMongo> findByIdGeneral(Integer idGeneral);
}
