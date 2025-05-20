package es.angelkrasimirov.timeweaver.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import es.angelkrasimirov.timeweaver.models.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
  List<Project> findByUserProjectRoles_User_Id(Long userId);
}
