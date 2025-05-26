package es.angelkrasimirov.timeweaver.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.dtos.UserRegistrationDto;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserController {

	@Autowired
	private UserService userService;

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/users")
	public ResponseEntity<List<User>> getUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/users/{userId}")
	public ResponseEntity<User> getUserById(@PathVariable Long userId) {
		User user = userService.getUserById(userId);

		if (user == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(user);
	}

	@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
	@PutMapping("/users/{userId}")
	public ResponseEntity<User> updateUser(@PathVariable Long userId, @Valid @RequestBody User user) {
		User existingUser = userService.getUserById(userId);

		if (existingUser == null) {
			return ResponseEntity.notFound().build();
		}

		existingUser.setUsername(user.getUsername());
		existingUser.setPassword(user.getPassword());

		User updatedUser = userService.hashPasswordUser(existingUser);
		updatedUser = userService.saveUser(updatedUser);
		return ResponseEntity.ok(updatedUser);
	}

	@PostMapping("/users")
	public ResponseEntity<User> createUser(@Valid @RequestBody UserRegistrationDto userRegistrationDto) {
		User newUser = userService.createNewUser(userRegistrationDto);
		newUser = userService.saveUser(newUser);
		return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
	}

	@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
	@DeleteMapping("/users/{userId}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
		try {
			userService.deleteUser(userId);
			return ResponseEntity.ok().build();
		} catch (NoResourceFoundException e) {
			return ResponseEntity.noContent().build();
		}
	}

	@GetMapping("/users/{username}/user")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
		User user = userService.getUserByUsername(username);
		return ResponseEntity.ok(user);
	}

	@GetMapping("/users/{username}/exists")
	public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
		return ResponseEntity.ok(userService.existsByUsername(username));
	}

	// @PostMapping("/users/register")
	// public ResponseEntity<User> registerUser(@RequestBody User user) {
	// 		User newUser = userService.registerUser(user)
	// 		return ResponseEntity.ok(newUser);
	// }
	//
	// @PostMapping("/users/login")
	// public ResponseEntity<String> loginUser(@RequestBody User user) {
	// String token = authenticationService.authenticateUser(user);
	// return ResponseEntity.ok(token);
	// }
}
