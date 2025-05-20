package es.angelkrasimirov.timeweaver.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.angelkrasimirov.timeweaver.models.Role;
import es.angelkrasimirov.timeweaver.models.ProjectRole;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.repositories.ProjectRoleRepository;
import es.angelkrasimirov.timeweaver.repositories.RoleRepository;
import es.angelkrasimirov.timeweaver.repositories.UserRepository;

import java.util.List;

@Configuration
public class DataInitializer {

	@Bean
	ApplicationRunner initRoles(
			RoleRepository roleRepository,
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			ProjectRoleRepository projectRoleRepository) {
		return args -> {
			// Initialize default roles
			List<String> defaultRoles = List.of("ROLE_USER", "ROLE_ADMIN");
			defaultRoles.forEach(roleName -> {
				roleRepository.findByName(roleName).orElseGet(() -> {
					Role role = new Role();
					role.setName(roleName);
					return roleRepository.save(role);
				});
			});

			// Initialize default project roles
			List<String> defaultProjectRoles = List.of(
					"ROLE_PROJECT_MANAGER",
					"ROLE_PROJECT_CONTRIBUTOR",
					"ROLE_PROJECT_VIEWER");
			defaultProjectRoles.forEach(roleName -> {
				projectRoleRepository.findByName(roleName).orElseGet(() -> {
					ProjectRole projectRole = new ProjectRole();
					projectRole.setName(roleName);
					return projectRoleRepository.save(projectRole);
				});
			});

			// Initialize admin user
			String adminUsername = "root";
			userRepository.findByUsername(adminUsername).orElseGet(() -> {
				Role adminRole = roleRepository.findByName("ROLE_ADMIN")
						.orElseThrow(() -> new RuntimeException("Admin role not found"));

				Role userRole = roleRepository.findByName("ROLE_USER")
						.orElseThrow(() -> new RuntimeException("User role not found"));

				User adminUser = new User();
				adminUser.setUsername(adminUsername);
				adminUser.setPassword(passwordEncoder.encode("temporary_password_to_change"));
				adminUser.addRole(adminRole);
				adminUser.addRole(userRole);

				return userRepository.save(adminUser);
			});
		};
	}
}
