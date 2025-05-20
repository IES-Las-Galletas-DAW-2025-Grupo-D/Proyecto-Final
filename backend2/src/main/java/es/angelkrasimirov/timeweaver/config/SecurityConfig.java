package es.angelkrasimirov.timeweaver.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import es.angelkrasimirov.timeweaver.filters.JwtAuthenticationFilter;
import es.angelkrasimirov.timeweaver.utils.JwtAccessDeniedHandler;
import es.angelkrasimirov.timeweaver.utils.JwtAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Autowired
	private JwtAccessDeniedHandler accessDeniedHandler;

	@Autowired
	private JwtAuthenticationFilter authenticationFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, UserDetailsService userDetailsService)
			throws Exception {
		httpSecurity
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/v1/auth/**").permitAll()
						.requestMatchers("/api/health/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/users/{username}/exists").permitAll()
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/ws/**").permitAll()
						.anyRequest().authenticated())
				.userDetailsService(userDetailsService)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		httpSecurity.exceptionHandling(exception -> exception
				.authenticationEntryPoint(jwtAuthenticationEntryPoint)
				.accessDeniedHandler(accessDeniedHandler));

		httpSecurity
				.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return httpSecurity.build();
	}

}
