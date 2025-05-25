package es.angelkrasimirov.timeweaver.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.angelkrasimirov.timeweaver.models.Project;
import es.angelkrasimirov.timeweaver.repositories.ProjectRepository;

@Service
public class ProjectService {
  @Autowired
  private ProjectRepository projectRepository;

  public List<Project> getAllProjects() {
    return projectRepository.findAll();
  }

  public List<Project> getProjectsByUserId(Long userId) {
    return projectRepository.findByUserProjectRoles_User_Id(userId);
  }

  public Project getProjectById(Long projectId) {
    return projectRepository.findById(projectId).orElse(null);
  }

  public Project saveProject(Project project) {
    return projectRepository.save(project);
  }

  public void deleteProject(Long projectId) {
    projectRepository.deleteById(projectId);
  }
}
