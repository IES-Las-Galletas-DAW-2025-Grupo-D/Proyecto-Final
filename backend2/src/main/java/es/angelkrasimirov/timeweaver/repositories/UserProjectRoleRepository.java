package es.angelkrasimirov.timeweaver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.models.UserProjectRole;
import es.angelkrasimirov.timeweaver.models.UserProjectRoleId;

public interface UserProjectRoleRepository extends JpaRepository<UserProjectRole, UserProjectRoleId> {

  boolean existsByProject_IdAndUser_IdAndProjectRole(Long projectId, Long id, ProjectRole projectRole);

  boolean existsByProject_IdAndUser_Id(Long projectId, Long userId);

}
