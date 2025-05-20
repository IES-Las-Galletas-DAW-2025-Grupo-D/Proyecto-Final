package es.angelkrasimirov.timeweaver.models;

import java.io.Serializable;
import java.util.Objects;

public class UserProjectRoleId implements Serializable {
  private Long project;
  private Long user;

  public UserProjectRoleId() {
  }

  public UserProjectRoleId(Long project, Long user) {
    this.project = project;
    this.user = user;
  }

  public Long getProject() {
    return project;
  }

  public void setProject(Long project) {
    this.project = project;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    UserProjectRoleId that = (UserProjectRoleId) o;
    return Objects.equals(project, that.project) && Objects.equals(user, that.user);
  }

  @Override
  public int hashCode() {
    return Objects.hash(project, user);
  }
}