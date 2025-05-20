package es.angelkrasimirov.timeweaver.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.models.Project;
import es.angelkrasimirov.timeweaver.models.ProjectInvitation;
import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.repositories.ProjectInvitationRepository;
import es.angelkrasimirov.timeweaver.repositories.ProjectRoleRepository;

@Service
public class ProjectInvitationService {

  @Autowired
  private ProjectInvitationRepository projectInvitationRepository;

  @Autowired
  private UserProjectRoleService userProjectRoleService;

  @Autowired
  private ProjectRoleRepository projectRoleRepository;

  @Autowired
  private NotificationService notificationService;

  public ProjectInvitation createInvitation(User inviter, User invited, Project project, ProjectRole projectRole) {
    boolean existingInvitation = projectInvitationRepository.existsByInvitedUser_IdAndProject_Id(
        invited.getId(), project.getId());

    if (existingInvitation) {
      throw new IllegalStateException("An invitation already exists for this user and project");
    }

    ProjectInvitation invitation = new ProjectInvitation(invited, inviter, project, projectRole);
    invitation = projectInvitationRepository.save(invitation);

    notificationService.sendNotificationToUser(
        invited.getUsername(),
        "project_invitation",
        invitation);

    return invitation;
  }

  public List<ProjectInvitation> getProjectInvitationsByUserId(Long userId) {
    return projectInvitationRepository.findByInvitedUser_Id(userId);
  }

  public ProjectInvitation getInvitationById(Long invitationId) throws NoResourceFoundException {
    return projectInvitationRepository.findById(invitationId)
        .orElseThrow(() -> new NoResourceFoundException(HttpMethod.GET, "Invitation not found"));
  }

  public ProjectInvitation getInvitationByProjectIdAndUserId(Long projectId, Long userId)
      throws NoResourceFoundException {
    return projectInvitationRepository.findByProject_IdAndInvitedUser_Id(projectId, userId)
        .orElseThrow(() -> new NoResourceFoundException(HttpMethod.GET, "Invitation not found"));
  }

  public void acceptInvitation(ProjectInvitation invitation) throws NoResourceFoundException {

    userProjectRoleService.createUserProjectRole(
        invitation.getInvitedUser(),
        invitation.getProject(),
        invitation.getProjectRole());

    projectInvitationRepository.delete(invitation);

    notificationService.sendNotificationToUser(
        invitation.getInviterUser().getUsername(),
        "invitation_accepted",
        invitation);
  }

  public void acceptInvitation(Long invitationId) throws NoResourceFoundException {
    ProjectInvitation invitation = getInvitationById(invitationId);

    acceptInvitation(invitation);
  }

  public void declineInvitation(ProjectInvitation invitation) throws NoResourceFoundException {
    projectInvitationRepository.delete(invitation);

    notificationService.sendNotificationToUser(
        invitation.getInviterUser().getUsername(),
        "invitation_declined",
        invitation);
  }

  public void declineInvitation(Long invitationId) throws NoResourceFoundException {
    ProjectInvitation invitation = getInvitationById(invitationId);

    deleteInvitation(invitation);
  }

  public void deleteInvitation(Long invitationId) {
    projectInvitationRepository.deleteById(invitationId);
  }

  public void deleteInvitation(ProjectInvitation invitation) {
    projectInvitationRepository.delete(invitation);
  }

  public List<ProjectInvitation> getInvitationsForProject(Long projectId) {
    return projectInvitationRepository.findByProject_Id(projectId);
  }
}