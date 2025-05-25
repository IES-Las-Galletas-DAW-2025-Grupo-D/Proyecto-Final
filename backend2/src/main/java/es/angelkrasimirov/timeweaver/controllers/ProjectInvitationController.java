package es.angelkrasimirov.timeweaver.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.config.CustomUserDetails;
import es.angelkrasimirov.timeweaver.models.Project;
import es.angelkrasimirov.timeweaver.models.ProjectInvitation;
import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.services.ProjectInvitationService;
import es.angelkrasimirov.timeweaver.services.ProjectService;
import es.angelkrasimirov.timeweaver.services.UserService;

@RestController
@RequestMapping("/api/v1")
public class ProjectInvitationController {

  @Autowired
  private ProjectService projectService;

  @Autowired
  private UserService userService;

  @Autowired
  private ProjectInvitationService projectInvitationService;

  @GetMapping("/users/{userId}/project-invitations")
  @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
  public ResponseEntity<List<ProjectInvitation>> getProjectInvitationsByUserId(
      @PathVariable Long userId) {
    List<ProjectInvitation> invitations = projectInvitationService.getProjectInvitationsByUserId(userId);
    return ResponseEntity.ok(invitations);
  }

  @PutMapping("/projects/{projectId}/users/{userId}/roles/{roleName}/invite")
  @PreAuthorize("hasRole('ADMIN') or @projectSecurityService.hasProjectRole(#projectId, 'ROLE_PROJECT_MANAGER')")
  public ResponseEntity<ProjectInvitation> inviteUserToProject(
      @PathVariable Long projectId,
      @PathVariable Long userId,
      @PathVariable String roleName,
      Authentication authentication) throws NoResourceFoundException {

    Project project = projectService.getProjectById(projectId);
    if (project == null) {
      return ResponseEntity.notFound().build();
    }

    User invitedUser = userService.getUserById(userId);
    if (invitedUser == null) {
      return ResponseEntity.notFound().build();
    }

    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    User inviterUser = userService.getUserById(userDetails.getId());

    ProjectRole projectRole;
    try {
      projectRole = ProjectRole.valueOf(roleName.toUpperCase());
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }

    ProjectInvitation invitation = projectInvitationService.createInvitation(
        inviterUser, invitedUser, project, projectRole);
    return ResponseEntity.ok(invitation);
  }

  @PutMapping("/projects/{projectId}/users/{userId}")
  @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
  public ResponseEntity<Void> acceptProjectInvitation(
      @PathVariable Long projectId,
      @PathVariable Long userId) throws NoResourceFoundException {

    Project project = projectService.getProjectById(projectId);
    if (project == null) {
      return ResponseEntity.notFound().build();
    }

    User invitedUser = userService.getUserById(userId);
    if (invitedUser == null) {
      return ResponseEntity.notFound().build();
    }

    ProjectInvitation invitation = projectInvitationService.getInvitationByProjectIdAndUserId(projectId, userId);
    projectInvitationService.acceptInvitation(invitation);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/projects/{projectId}/users/{userId}/invite")
  @PreAuthorize("hasRole('ADMIN') or @projectSecurityService.hasProjectRole(#projectId, 'ROLE_PROJECT_MANAGER') or #userId == authentication.principal.id")
  public ResponseEntity<Void> declineProjectInvitation(
      @PathVariable Long projectId,
      @PathVariable Long userId) throws NoResourceFoundException {

    Project project = projectService.getProjectById(projectId);
    if (project == null) {
      return ResponseEntity.notFound().build();
    }

    User invitedUser = userService.getUserById(userId);
    if (invitedUser == null) {
      return ResponseEntity.notFound().build();
    }

    ProjectInvitation invitation = projectInvitationService.getInvitationByProjectIdAndUserId(projectId, userId);
    projectInvitationService.declineInvitation(invitation);
    return ResponseEntity.ok().build();
  }

}
