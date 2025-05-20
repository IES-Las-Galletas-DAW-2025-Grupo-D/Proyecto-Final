package es.angelkrasimirov.timeweaver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import es.angelkrasimirov.timeweaver.models.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(String name);
}
