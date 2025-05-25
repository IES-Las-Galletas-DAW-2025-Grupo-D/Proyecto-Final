package es.angelkrasimirov.timeweaver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotNull(message = "Username is required")
	@Column(unique = true)
	private String username;

	@Email(message = "Invalid email")
	private String email;

	private String phone;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@NotNull(message = "Password is required")
	private String password;

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id"))
	@Enumerated(EnumType.STRING)
	private List<Role> roles = new ArrayList<>();

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<UserProjectRole> userProjectRoles = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public void addRole(Role role) {
		this.roles.add(role);
	}

	public void removeRole(Role role) {
		this.roles.remove(role);
	}

	public List<UserProjectRole> getUserProjectRoles() {
		return userProjectRoles;
	}

	public void setUserProjectRoles(List<UserProjectRole> userProjectRoles) {
		this.userProjectRoles = userProjectRoles;
	}

	public void addUserProjectRole(UserProjectRole userProjectRole) {
		this.userProjectRoles.add(userProjectRole);
		userProjectRole.setUser(this);
	}

	public void removeUserProjectRole(UserProjectRole userProjectRole) {
		this.userProjectRoles.remove(userProjectRole);
		userProjectRole.setUser(null);
	}

}
