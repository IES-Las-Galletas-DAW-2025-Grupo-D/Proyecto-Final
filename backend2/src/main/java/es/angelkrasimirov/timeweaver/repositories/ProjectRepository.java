package es.angelkrasimirov.timeweaver.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import es.angelkrasimirov.timeweaver.models.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
  Page<Project> findByUserProjectRoles_User_Id(Long userId, Pageable pageable);
}
