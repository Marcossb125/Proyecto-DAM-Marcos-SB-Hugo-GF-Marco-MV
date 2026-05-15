package com.convergence.convergence.repository.mongodb;

import com.convergence.convergence.model.mongodb.UsuarioMongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UsuarioMongoRepository extends MongoRepository<UsuarioMongo, String> {
    List<UsuarioMongo> findByOrderByVictoriasDesc();

    List<UsuarioMongo> findByIdGeneral(Integer idGeneral);
}
