package es.angelkrasimirov.timeweaver.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_invitations")
public class ProjectInvitation {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "invited_user_id")
  private User invitedUser;

  @ManyToOne
  @JoinColumn(name = "inviter_user_id")
  private User inviterUser;

  @ManyToOne
  @JoinColumn(name = "project_id")
  private Project project;

  @Enumerated(EnumType.STRING)
  private ProjectRole projectRole;

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  public ProjectInvitation() {
    this.createdAt = LocalDateTime.now();
  }

  public ProjectInvitation(User invitedUser, User inviterUser, Project project, ProjectRole projectRole) {
    this();
    this.invitedUser = invitedUser;
    this.inviterUser = inviterUser;
    this.project = project;
    this.projectRole = projectRole;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getInvitedUser() {
    return invitedUser;
  }

  public void setInvitedUser(User invitedUser) {
    this.invitedUser = invitedUser;
  }

  public User getInviterUser() {
    return inviterUser;
  }

  public void setInviterUser(User inviterUser) {
    this.inviterUser = inviterUser;
  }

  public Project getProject() {
    return project;
  }

  public void setProject(Project project) {
    this.project = project;
  }

  public ProjectRole getProjectRole() {
    return projectRole;
  }

  public void setProjectRole(ProjectRole projectRole) {
    this.projectRole = projectRole;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}