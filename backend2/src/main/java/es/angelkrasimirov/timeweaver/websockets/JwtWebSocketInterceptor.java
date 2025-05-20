package es.angelkrasimirov.timeweaver.websockets;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.repositories.UserProjectRoleRepository;
import es.angelkrasimirov.timeweaver.repositories.UserRepository;
import es.angelkrasimirov.timeweaver.utils.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtWebSocketInterceptor implements HandshakeInterceptor {

  private static final Logger logger = LoggerFactory.getLogger(JwtWebSocketInterceptor.class);

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private UserProjectRoleRepository userProjectRoleRepository;

  @Override
  public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
      WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

    String path = request.getURI().getPath();
    Long projectId = extractProjectId(path);

    if (projectId == null) {
      logger.warn("Invalid project ID in WebSocket connection path: {}", path);
      return false;
    }

    attributes.put("projectId", projectId);

    if (request instanceof ServletServerHttpRequest) {
      ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
      String token = extractToken(servletRequest.getServletRequest());

      if (token != null && jwtTokenProvider.validateToken(token)) {
        String username = jwtTokenProvider.getUsername(token);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
          User user = userOpt.get();

          boolean hasAccess = userProjectRoleRepository.existsByProject_IdAndUser_IdAndProjectRole_Name(
              projectId, user.getId(), "ROLE_PROJECT_MANAGER") ||
              userProjectRoleRepository.existsByProject_IdAndUser_IdAndProjectRole_Name(
                  projectId, user.getId(), "ROLE_PROJECT_CONTRIBUTOR")
              ||
              userProjectRoleRepository.existsByProject_IdAndUser_IdAndProjectRole_Name(
                  projectId, user.getId(), "ROLE_PROJECT_VIEWER");

          if (hasAccess) {
            attributes.put("username", username);
            attributes.put("userId", user.getId());
            logger.info("Authenticated WebSocket connection for user: {} to project: {}", username, projectId);
            return true;
          } else {
            logger.warn("User {} attempted to access unauthorized project: {}", username, projectId);
            return false;
          }
        }
      }

      logger.warn("Unauthorized WebSocket connection attempt to project: {}", projectId);
      return false;
    }
    return false;
  }

  @Override
  public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
      WebSocketHandler wsHandler, Exception exception) {
  }

  private Long extractProjectId(String path) {
    String[] segments = path.split("/");
    if (segments.length >= 4) {
      try {
        return Long.parseLong(segments[3]);
      } catch (NumberFormatException e) {
        return null;
      }
    }
    return null;
  }

  private String extractToken(HttpServletRequest request) {
    String token = request.getParameter("token");
    if (token != null && !token.isEmpty()) {
      return token;
    }

    String bearerToken = request.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }

    String protocols = request.getHeader("Sec-WebSocket-Protocol");
    if (protocols != null && protocols.startsWith("Bearer ")) {
      return protocols.substring(7);
    }

    return null;
  }
}