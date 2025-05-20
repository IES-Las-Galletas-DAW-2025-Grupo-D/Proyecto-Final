package es.angelkrasimirov.timeweaver.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_FORBIDDEN);

		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("error", "Forbidden");
		errorResponse.put("message", "You don't have permission to access this resource");

		OutputStream out = response.getOutputStream();
		ObjectMapper mapper = new ObjectMapper();
		mapper.writeValue(out, errorResponse);
		out.flush();
	}
}
