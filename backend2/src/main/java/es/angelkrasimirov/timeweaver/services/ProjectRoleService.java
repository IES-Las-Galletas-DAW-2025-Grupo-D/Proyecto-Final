package es.angelkrasimirov.timeweaver.services;

import java.net.http.HttpRequest;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.repositories.ProjectRoleRepository;

@Service
public class ProjectRoleService {
  @Autowired
  private ProjectRoleRepository projectRoleRepository;

  public List<ProjectRole> getAllProjectRoles() {
    return projectRoleRepository.findAll();
  }

  public ProjectRole getProjectRoleByName(String name) throws NoResourceFoundException {
    return projectRoleRepository.findByName(name)
        .orElseThrow(() -> new NoResourceFoundException(HttpMethod.GET, "ProjectRole not found"));
  }

  public ProjectRole getProjectRoleById(Long id) throws NoResourceFoundException {
    return projectRoleRepository.findById(id)
        .orElseThrow(() -> new NoResourceFoundException(HttpMethod.GET, "ProjectRole not found"));
  }
}
