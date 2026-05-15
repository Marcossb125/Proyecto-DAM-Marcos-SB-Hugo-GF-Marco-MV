package com.convergence.convergence.controller;

import com.convergence.convergence.model.mongodb.UsuarioMongo;
import com.convergence.convergence.repository.mongodb.UsuarioMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    @Autowired
    private UsuarioMongoRepository usuarioMongoRepository;

    @GetMapping
    public List<UsuarioMongo> getRanking() {
        return usuarioMongoRepository.findByOrderByVictoriasDesc();
    }

    @GetMapping("/general/{id}")
    public Long getGeneralStats(@PathVariable Integer id) {
        List<UsuarioMongo> usersWithGeneral = usuarioMongoRepository.findByIdGeneral(id);
        return usersWithGeneral.stream()
                .mapToLong(u -> u.getVictorias() != null ? u.getVictorias() : 0)
                .sum();
    }
}
