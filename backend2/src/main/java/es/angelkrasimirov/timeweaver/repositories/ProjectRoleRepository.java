package es.angelkrasimirov.timeweaver.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import es.angelkrasimirov.timeweaver.models.ProjectRole;

public interface ProjectRoleRepository extends JpaRepository<ProjectRole, Long> {
  Optional<ProjectRole> findByName(String name);

}
