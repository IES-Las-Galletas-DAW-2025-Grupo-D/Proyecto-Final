package es.angelkrasimirov.timeweaver.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.models.Project;
import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.models.UserProjectRole;
import es.angelkrasimirov.timeweaver.models.UserProjectRoleId;
import es.angelkrasimirov.timeweaver.repositories.ProjectRoleRepository;
import es.angelkrasimirov.timeweaver.repositories.UserProjectRoleRepository;

@Service
public class UserProjectRoleService {

  @Autowired
  private UserProjectRoleRepository userProjectRoleRepository;

  @Autowired
  private ProjectRoleRepository projectRoleRepository;

  

  public UserProjectRole createUserProjectRole(UserProjectRole userProjectRole) {
    return userProjectRoleRepository.save(userProjectRole);
  }

  public UserProjectRole createUserProjectRole(User user, Project project, ProjectRole projectRole) {
    UserProjectRole userProjectRole = new UserProjectRole();
    userProjectRole.setUser(user);
    userProjectRole.setProject(project);
    userProjectRole.setProjectRole(projectRole);
    return userProjectRoleRepository.save(userProjectRole);
  }

  public UserProjectRole createUserProjectRole(User user, Project project) throws NoResourceFoundException {
    ProjectRole projectRole = projectRoleRepository.findByName("ROLE_PROJECT_MANAGER")
        .orElseThrow(
            () -> new NoResourceFoundException(HttpMethod.GET, "ProjectRole not found"));

    UserProjectRole userProjectRole = new UserProjectRole();
    userProjectRole.setUser(user);
    userProjectRole.setProject(project);
    userProjectRole.setProjectRole(projectRole);
    return userProjectRoleRepository.save(userProjectRole);
  }

  public UserProjectRole getUserProjectRoleById(UserProjectRoleId id) throws NoResourceFoundException {
    return userProjectRoleRepository.findById(id)
        .orElseThrow(() -> new NoResourceFoundException(HttpMethod.GET, "UserProjectRole not found"));
  }
}
