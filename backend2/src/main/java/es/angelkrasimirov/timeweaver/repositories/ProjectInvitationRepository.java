package es.angelkrasimirov.timeweaver.repositories;

import es.angelkrasimirov.timeweaver.models.ProjectInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Long> {

  List<ProjectInvitation> findByInvitedUser_Id(Long invitedUserId);

  List<ProjectInvitation> findByProject_Id(Long projectId);

  Optional<ProjectInvitation> findByProject_IdAndInvitedUser_Id(Long projectId, Long invitedUserId);

  boolean existsByInvitedUser_IdAndProject_Id(Long invitedUserId, Long projectId);
}