package es.angelkrasimirov.timeweaver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.repositories.UserProjectRoleRepository;
import es.angelkrasimirov.timeweaver.repositories.UserRepository;

import java.util.Optional;

@Service("projectSecurityService")
public class ProjectSecurityService {

  private final UserProjectRoleRepository userProjectRoleRepository;
  private final UserRepository userRepository;

  @Autowired
  public ProjectSecurityService(UserProjectRoleRepository userProjectRoleRepository, UserRepository userRepository) {
    this.userProjectRoleRepository = userProjectRoleRepository;
    this.userRepository = userRepository;
  }

  public boolean hasProjectRole(Long projectId, String roleName) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return false;
    }

    String username = authentication.getName();
    Optional<User> userOptional = userRepository.findByUsername(username);
    if (!userOptional.isPresent()) {
      return false;
    }
    User user = userOptional.get();

    ProjectRole projectRole;
    try {
      projectRole = ProjectRole.valueOf(roleName);
    } catch (IllegalArgumentException e) {
      return false;
    }
    return userProjectRoleRepository.existsByProject_IdAndUser_IdAndProjectRole(
        projectId, user.getId(), projectRole);
  }

  public boolean hasAnyProjectRole(Long projectId, String... roleNames) {
    for (String roleName : roleNames) {
      if (hasProjectRole(projectId, roleName)) {
        return true;
      }
    }
    return false;
  }
}