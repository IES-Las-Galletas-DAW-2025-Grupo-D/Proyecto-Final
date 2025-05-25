package es.angelkrasimirov.timeweaver.config.initializers;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import es.angelkrasimirov.timeweaver.models.Role;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.repositories.UserRepository;

@Component
public class UserInitializer extends AbstractDataInitializer {

  @Value("${app.admin.username}")
  private String adminUsername;

  @Value("${app.admin.password}")
  private String adminPassword;

  @Value("${app.defaultUser.username}")
  private String defaultUserUsername;

  @Value("${app.defaultUser.password}")
  private String defaultUserPassword;

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserInitializer(UserRepository userRepository,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public Set<Class<? extends DataInitializer>> getDependencies() {
    return Set.of();
  }

  @Override
  public void initialize() {
    userRepository.save(userRepository.findByUsername(adminUsername).orElseGet(() -> {
      User adminUser = new User();
      adminUser.setUsername(adminUsername);
      adminUser.setEmail(adminUsername + "@test.com");
      adminUser.setPassword(passwordEncoder.encode(adminPassword));
      adminUser.addRole(Role.ROLE_ADMIN);
      adminUser.addRole(Role.ROLE_USER);

      return adminUser;
    }));

    userRepository.save(userRepository.findByUsername(defaultUserUsername).orElseGet(() -> {
      User defaultUser = new User();
      defaultUser.setUsername(defaultUserUsername);
      defaultUser.setEmail(defaultUserUsername + "@test.com");
      defaultUser.setPassword(passwordEncoder.encode(defaultUserPassword));
      defaultUser.addRole(Role.ROLE_USER);

      return defaultUser;
    }));
  }
}