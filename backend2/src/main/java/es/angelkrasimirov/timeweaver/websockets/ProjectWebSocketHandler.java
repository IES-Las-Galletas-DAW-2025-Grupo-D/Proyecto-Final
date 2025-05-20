package es.angelkrasimirov.timeweaver.websockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

@Component
public class ProjectWebSocketHandler extends TextWebSocketHandler {

  private static final Logger logger = LoggerFactory.getLogger(ProjectWebSocketHandler.class);
  private final ObjectMapper objectMapper = new ObjectMapper();

  private final ConcurrentHashMap<Long, ConcurrentHashMap<String, WebSocketSession>> projectSessions = new ConcurrentHashMap<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    String username = (String) session.getAttributes().get("username");
    Long projectId = (Long) session.getAttributes().get("projectId");

    if (username != null && projectId != null) {
      projectSessions
          .computeIfAbsent(projectId, k -> new ConcurrentHashMap<>())
          .put(username, session);

      logger.info("WebSocket connection established for user {} in project {}", username, projectId);

      sendMessage(session, Map.of(
          "type", "connection_success",
          "projectId", projectId,
          "username", username,
          "activeUsers", getActiveUsers(projectId)));

      broadcastToProject(projectId, username, Map.of(
          "type", "user_joined",
          "username", username,
          "activeUsers", getActiveUsers(projectId),
          "timestamp", System.currentTimeMillis()));
    } else {
      logger.warn("WebSocket connection attempt without proper authentication or project ID");
      session.close();
    }
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    String payload = message.getPayload();
    String username = (String) session.getAttributes().get("username");
    Long projectId = (Long) session.getAttributes().get("projectId");

    if (username == null || projectId == null) {
      sendMessage(session, Map.of("type", "error", "message", "Authentication required"));
      return;
    }

    logger.debug("Received message from user {} in project {}: {}", username, projectId, payload);

    try {
      Map<String, Object> event = objectMapper.readValue(payload, Map.class);
      String type = (String) event.get("type");
      Object data = event.get("data");

      switch (type) {
        case "add":
        case "update":
        case "move":
        case "delete":

          broadcastToProject(projectId, username, Map.of(
              "type", type,
              "data", data,
              "username", username,
              "timestamp", System.currentTimeMillis()));
          break;
        default:
          logger.warn("Unknown event type: {}", type);
          break;
      }
    } catch (Exception e) {
      logger.error("Error processing WebSocket message: {}", e.getMessage());
      sendMessage(session, Map.of("type", "error", "message", "Invalid message format"));
    }
  }

  private void broadcastToProject(Long projectId, String senderUsername, Map<String, Object> message) {
    ConcurrentHashMap<String, WebSocketSession> sessions = projectSessions.get(projectId);
    if (sessions != null) {
      sessions.forEach((username, session) -> {
        if (!username.equals(senderUsername) && session.isOpen()) {
          try {
            sendMessage(session, message);
          } catch (Exception e) {
            logger.error("Error broadcasting message to user {}: {}", username, e.getMessage());
          }
        }
      });
    }
  }

  public void broadcastToAllInProject(Long projectId, Map<String, Object> message) {
    ConcurrentHashMap<String, WebSocketSession> sessions = projectSessions.get(projectId);
    if (sessions != null) {
      sessions.forEach((username, session) -> {
        if (session.isOpen()) {
          try {
            sendMessage(session, message);
          } catch (Exception e) {
            logger.error("Error broadcasting message to user {}: {}", username, e.getMessage());
          }
        }
      });
    }
  }

  private void sendMessage(WebSocketSession session, Map<String, Object> message) {
    try {
      if (session.isOpen()) {
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
      }
    } catch (IOException e) {
      logger.error("Error sending message to WebSocket client: {}", e.getMessage());
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status)
      throws Exception {
    String username = (String) session.getAttributes().get("username");
    Long projectId = (Long) session.getAttributes().get("projectId");

    if (username != null && projectId != null) {

      ConcurrentHashMap<String, WebSocketSession> sessions = projectSessions.get(projectId);
      if (sessions != null) {
        sessions.remove(username);

        if (sessions.isEmpty()) {
          projectSessions.remove(projectId);
        } else {

          broadcastToProject(projectId, username, Map.of(
              "type", "user_left",
              "username", username,
              "activeUsers", getActiveUsers(projectId),
              "timestamp", System.currentTimeMillis()));
        }
      }
    }

    logger.info("WebSocket connection closed: {}, reason: {}", session.getId(), status);
  }

  @Override
  public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
    logger.error("WebSocket transport error: {}", exception.getMessage());
  }

  private List<String> getActiveUsers(Long projectId) {
    ConcurrentHashMap<String, WebSocketSession> sessions = projectSessions.get(projectId);
    if (sessions != null) {
      return new ArrayList<>(sessions.keySet());
    }
    return Collections.emptyList();
  }
}