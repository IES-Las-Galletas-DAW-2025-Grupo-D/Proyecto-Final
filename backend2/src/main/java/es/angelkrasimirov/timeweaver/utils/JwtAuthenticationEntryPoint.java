package es.angelkrasimirov.timeweaver.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
		System.out.println("Authentication error: " + authException.getClass().getName());
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("error", "Unauthorized");
		errorResponse.put("message", "You need to log in to access this resource");

		OutputStream out = response.getOutputStream();
		ObjectMapper mapper = new ObjectMapper();
		mapper.writeValue(out, errorResponse);
		out.flush();
	}
}
