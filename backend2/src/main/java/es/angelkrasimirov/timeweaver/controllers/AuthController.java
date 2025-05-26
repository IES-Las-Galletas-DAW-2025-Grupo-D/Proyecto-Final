package es.angelkrasimirov.timeweaver.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.angelkrasimirov.timeweaver.dtos.AuthResponseDto;
import es.angelkrasimirov.timeweaver.dtos.UserLoginDto;
import es.angelkrasimirov.timeweaver.dtos.UserRegistrationDto;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.services.AuthenticationService;
import es.angelkrasimirov.timeweaver.services.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private UserService userService;

	@PostMapping("/login")
	public ResponseEntity<AuthResponseDto> login(@RequestBody UserLoginDto loginDto) throws InterruptedException {

		Thread.sleep(500 + (long) (Math.random() * 500)); // Simulate internal server delay

		String token = authenticationService.login(loginDto);

		AuthResponseDto authResponseDto = new AuthResponseDto();
		authResponseDto.setToken(token);

		return ResponseEntity.ok(authResponseDto);
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
		if (userService.existsByUsername(registrationDto.getUsername())) {
			throw new IllegalArgumentException("Username already exists");
		}
		User user = userService.createNewUser(registrationDto);
		userService.saveUser(user);
		return ResponseEntity.ok().build();
	}
}
