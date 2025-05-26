package es.angelkrasimirov.timeweaver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import es.angelkrasimirov.timeweaver.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsername(String username);

	boolean existsByUsername(String username);
}
