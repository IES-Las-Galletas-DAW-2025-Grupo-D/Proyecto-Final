package es.angelkrasimirov.timeweaver.models;

import java.util.ArrayList;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "projects")
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @NotNull(message = "Name is required")
  private String name;

  private String description;

  @JsonIgnore
  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
  private List<UserProjectRole> userProjectRoles = new ArrayList<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<UserProjectRole> getUserProjectRoles() {
    return userProjectRoles;
  }

  public void setUserProjectRoles(List<UserProjectRole> userProjectRoles) {
    this.userProjectRoles = userProjectRoles;
  }

  public void addUserProjectRole(UserProjectRole userProjectRole) {
    this.userProjectRoles.add(userProjectRole);
    userProjectRole.setProject(this);
  }

  public void removeUserProjectRole(UserProjectRole userProjectRole) {
    this.userProjectRoles.remove(userProjectRole);
    userProjectRole.setProject(null);
  }
}
