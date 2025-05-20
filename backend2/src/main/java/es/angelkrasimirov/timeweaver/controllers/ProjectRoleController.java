package es.angelkrasimirov.timeweaver.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.models.UserProjectRole;
import es.angelkrasimirov.timeweaver.models.UserProjectRoleId;
import es.angelkrasimirov.timeweaver.services.ProjectRoleService;
import es.angelkrasimirov.timeweaver.services.UserProjectRoleService;

@RestController
@RequestMapping("/api/v1")
public class ProjectRoleController {

  @Autowired
  private UserProjectRoleService userProjectRoleService;

  @Autowired
  private ProjectRoleService projectRoleService;

  @GetMapping("/project-roles")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<List<ProjectRole>> getProjectRoles() {
    return ResponseEntity.ok(projectRoleService.getAllProjectRoles());
  }

  @GetMapping("/projects/{projectId}/users-role/{userId}")
  @PreAuthorize("@projectSecurityService.hasAnyProjectRole(#projectId, 'ROLE_PROJECT_MANAGER', 'ROLE_PROJECT_CONTRIBUTOR', 'ROLE_PROJECT_VIEWER')")
  public ResponseEntity<ProjectRole> getUserRolesByProjectId(
      @PathVariable Long projectId,
      @PathVariable Long userId) throws NoResourceFoundException {

    UserProjectRoleId userProjectRoleId = new UserProjectRoleId(projectId, userId);
    UserProjectRole userRol = userProjectRoleService.getUserProjectRoleById(userProjectRoleId);
    return ResponseEntity.ok(userRol.getProjectRole());
  }

}
