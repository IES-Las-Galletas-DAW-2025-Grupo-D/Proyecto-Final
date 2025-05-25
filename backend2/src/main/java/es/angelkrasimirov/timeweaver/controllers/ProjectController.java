package es.angelkrasimirov.timeweaver.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.models.Project;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.models.UserProjectRole;
import es.angelkrasimirov.timeweaver.services.ProjectService;
import es.angelkrasimirov.timeweaver.services.UserProjectRoleService;
import es.angelkrasimirov.timeweaver.services.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class ProjectController {

  private static final int PAGE_SIZE = 6;

  @Autowired
  private ProjectService projectService;

  @Autowired
  private UserService userService;

  @Autowired
  private UserProjectRoleService userProjectRoleService;

  @PreAuthorize("hasRole('ADMIN') or " +
      "@projectSecurityService.hasAnyProjectRole(#projectId)")
  @GetMapping("/projects/{projectId}")
  public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
    Project project = projectService.getProjectById(projectId);
    if (project == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(project);
  }

  @GetMapping("/users/{userId}/projects")
  @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
  public ResponseEntity<Page<Project>> getProjectsByUserId(@PathVariable Long userId,
      @RequestParam(defaultValue = "0") int page) {
    Pageable pageable = PageRequest.of(page, PAGE_SIZE);
    Page<Project> projects = projectService.getProjectsByUserId(userId, pageable);
    return ResponseEntity.ok(projects);
  }

  @PostMapping("/users/{userId}/projects")
  @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
  public ResponseEntity<Project> createProject(@PathVariable Long userId, @Valid @RequestBody Project project)
      throws NoResourceFoundException {
    User user = userService.getUserById(userId);
    if (user == null) {
      return ResponseEntity.notFound().build();
    }

    Project createdProject = projectService.saveProject(project);

    UserProjectRole userProjectRole = userProjectRoleService.createUserProjectRole(user, createdProject);

    createdProject.addUserProjectRole(userProjectRole);

    createdProject = projectService.saveProject(createdProject);

    return ResponseEntity.status(201).body(createdProject);
  }

  @DeleteMapping("/projects/{projectId}")
  @PreAuthorize("hasRole('ADMIN') or @projectSecurityService.hasProjectRole(#projectId, 'ROLE_PROJECT_MANAGER')")
  public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {

    projectService.deleteProject(projectId);
    return ResponseEntity.ok().build();

  }
}
