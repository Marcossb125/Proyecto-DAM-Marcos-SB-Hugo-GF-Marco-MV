package com.convergence.convergence.repository;

import com.convergence.convergence.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNickname(String nickname);
    Optional<User> findByEmail(String email);
    List<User> findByOrderByVictoriasDesc();
    List<User> findByGeneralId(Long generalId);
}
