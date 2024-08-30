package com.w.tokenw.repository;

import com.w.tokenw.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    Optional<User> findById(Integer id);

    List<User> findAll();

    Optional<User> findByVerificationCode(String verificationCode);

}
