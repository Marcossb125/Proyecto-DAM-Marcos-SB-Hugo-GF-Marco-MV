package com.convergence.convergence.controller;

import com.convergence.convergence.model.User;
import com.convergence.convergence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getRanking() {
        return userRepository.findByOrderByVictoriasDesc();
    }

    @GetMapping("/general/{id}")
    public Long getGeneralStats(@PathVariable Long id) {
        List<User> usersWithGeneral = userRepository.findByGeneralId(id);
        return usersWithGeneral.stream()
                .mapToLong(u -> u.getVictorias() != null ? u.getVictorias() : 0)
                .sum();
    }

    @GetMapping("/user/{nickname}")
    public User getUserProfile(@PathVariable String nickname) {
        return userRepository.findByNickname(nickname).orElse(null);
    }
}
