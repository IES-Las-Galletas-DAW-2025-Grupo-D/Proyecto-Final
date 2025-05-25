package es.angelkrasimirov.timeweaver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import es.angelkrasimirov.timeweaver.models.Project;
import es.angelkrasimirov.timeweaver.repositories.ProjectRepository;

@Service
public class ProjectService {
  @Autowired
  private ProjectRepository projectRepository;

  public Page<Project> getProjectsByUserId(Long userId, Pageable pageable) {
    return projectRepository.findByUserProjectRoles_User_Id(userId, pageable);
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
