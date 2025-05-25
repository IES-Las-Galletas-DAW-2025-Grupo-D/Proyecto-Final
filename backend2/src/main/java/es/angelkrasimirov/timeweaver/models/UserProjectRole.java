package es.angelkrasimirov.timeweaver.models;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_project_roles")
@IdClass(UserProjectRoleId.class)
public class UserProjectRole {

  @Id
  @ManyToOne
  @JoinColumn(name = "project_id")
  private Project project;

  @Id
  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @Enumerated(EnumType.STRING)
  private ProjectRole projectRole;

  public Project getProject() {
    return project;
  }

  public void setProject(Project project) {
    this.project = project;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public ProjectRole getProjectRole() {
    return projectRole;
  }

  public void setProjectRole(ProjectRole projectRole) {
    this.projectRole = projectRole;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    UserProjectRole that = (UserProjectRole) o;
    return Objects.equals(project, that.project) && Objects.equals(user, that.user);
  }

  @Override
  public int hashCode() {
    return Objects.hash(project, user);
  }

}
