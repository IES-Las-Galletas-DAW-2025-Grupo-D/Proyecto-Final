package es.angelkrasimirov.timeweaver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import es.angelkrasimirov.timeweaver.models.UserProjectRole;
import es.angelkrasimirov.timeweaver.models.UserProjectRoleId;

public interface UserProjectRoleRepository extends JpaRepository<UserProjectRole, UserProjectRoleId> {

  boolean existsByProject_IdAndUser_IdAndProjectRole_Name(Long projectId, Long userId, String roleName);
}
