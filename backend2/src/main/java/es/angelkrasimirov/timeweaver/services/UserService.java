package es.angelkrasimirov.timeweaver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.config.CustomUserDetails;
import es.angelkrasimirov.timeweaver.dtos.UserLoginDto;
import es.angelkrasimirov.timeweaver.dtos.UserRegistrationDto;
import es.angelkrasimirov.timeweaver.mappers.UserMapper;
import es.angelkrasimirov.timeweaver.models.Role;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.repositories.UserRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public User getUserById(Long id) {
		return userRepository.findById(id).orElse(null);
	}

	public User createNewUser(UserRegistrationDto userRegistrationDto) {
		User user = convertToEntity(userRegistrationDto);
		user.addRole(Role.ROLE_USER);
		return hashPasswordUser(user);
	}

	public User saveUser(User user) {
		return userRepository.save(user);
	}

	public User hashPasswordUser(User user) {
		String hashedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(hashedPassword);
		return user;
	}

	public void deleteUser(Long id) throws NoResourceFoundException {
		if (!userRepository.existsById(id)) {
			throw new NoResourceFoundException(HttpMethod.DELETE, "No user found with id " + id);
		}
		userRepository.deleteById(id);
	}

	public void deleteUser(User user) {
		userRepository.delete(user);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		Set<GrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.name()))
				.collect(Collectors.toSet());

		return new CustomUserDetails(
				user.getId(),
				username,
				user.getPassword(),
				authorities);
	}

	public UserLoginDto convertToLoginDto(User user) {
		return UserMapper.INSTANCE.toLoginDto(user);
	}

	public User convertToEntity(UserLoginDto userDTO) {
		return UserMapper.INSTANCE.toEntity(userDTO);
	}

	public UserRegistrationDto convertToRegistrationDto(User user) {
		return UserMapper.INSTANCE.toRegistrationDto(user);
	}

	public User convertToEntity(UserRegistrationDto userDTO) {
		return UserMapper.INSTANCE.toEntity(userDTO);
	}

	public boolean existsByUsername(String username) {
		return userRepository.existsByUsername(username);
	}

	public User getUserByUsername(String username) {
		return userRepository.findByUsername(username).orElseThrow(
				() -> new UsernameNotFoundException("User not found with username: " + username));
	}
}
