package es.angelkrasimirov.timeweaver.websockets;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.angelkrasimirov.timeweaver.dtos.WebSocketMessage;
import es.angelkrasimirov.timeweaver.models.Event;
import es.angelkrasimirov.timeweaver.models.Project;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.repositories.EventRepository;
// import es.angelkrasimirov.timeweaver.repositories.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProjectWebSocketHandler extends TextWebSocketHandler {

  private static final Logger logger = LoggerFactory.getLogger(ProjectWebSocketHandler.class);
  private final ObjectMapper objectMapper;
  private final EventRepository eventRepository;

  private final ConcurrentHashMap<Long, ConcurrentHashMap<String, WebSocketSession>> projectSessions = new ConcurrentHashMap<>();

  public ProjectWebSocketHandler(ObjectMapper objectMapper, EventRepository eventRepository) {
    this.objectMapper = objectMapper;
    this.eventRepository = eventRepository;

  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    String username = (String) session.getAttributes().get("username");
    Long projectId = (Long) session.getAttributes().get("projectId");

    if (username != null && projectId != null) {
      projectSessions
          .computeIfAbsent(projectId, k -> new ConcurrentHashMap<>())
          .put(username, session);

      logger.info("WebSocket connection established for user {} in project {}", username, projectId);

      List<Event> projectEventEntities = eventRepository.findByProjectId(projectId);
      List<Map<String, Object>> projectEventsPayloads = projectEventEntities.stream()
          .map(eventEntity -> {
            Map<String, Object> eventContent = new HashMap<>();
            String jsonData = eventEntity.getData();

            if (jsonData != null && !jsonData.trim().isEmpty()) {
              try {

                eventContent = objectMapper.readValue(jsonData,
                    new TypeReference<Map<String, Object>>() {
                    });
              } catch (IOException e) {
                logger.error("Error deserializing event data for event ID {}: {}. Raw data: '{}'",
                    eventEntity.getId(), e.getMessage(), jsonData, e);
                return null;
              }
            } else {
              if (jsonData == null) {
                logger.warn("Event data is null for event ID {}. Sending event with ID and empty data.",
                    eventEntity.getId());
              } else {
                logger.warn("Event data is blank for event ID {}. Sending event with ID and empty data.",
                    eventEntity.getId());
              }

            }

            eventContent.put("id", eventEntity.getId());

            return eventContent;
          })
          .filter(Objects::nonNull)
          .collect(Collectors.toList());

      WebSocketMessage connectionSuccessMessage = new WebSocketMessage("connection_success", Map.of(
          "projectId", projectId,
          "username", username,
          "activeUsers", getActiveUsers(projectId),
          "projectEvents", projectEventsPayloads));

      sendMessage(session, connectionSuccessMessage);

      WebSocketMessage userJoinedMessage = new WebSocketMessage("user_joined", Map.of(
          "username", username,
          "activeUsers", getActiveUsers(projectId)));

      broadcastToProject(projectId, username, userJoinedMessage);
    } else {
      logger.warn("WebSocket connection attempt without proper authentication or project ID");
      session.close();
    }
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    String payload = message.getPayload();
    String senderUsername = (String) session.getAttributes().get("username");
    Long projectId = (Long) session.getAttributes().get("projectId");

    if (senderUsername == null || projectId == null) {
      WebSocketMessage errorMessage = new WebSocketMessage("error", Map.of(
          "message", "Authentication required"));
      sendMessage(session, errorMessage);
      return;
    }

    logger.debug("Received message from user {} in project {}: {}", senderUsername, projectId, payload);

    try {
      Map<String, Object> receivedMessage = objectMapper.readValue(payload, new TypeReference<Map<String, Object>>() {
      });
      String type = (String) receivedMessage.get("type");
      Object rawOuterData = receivedMessage.get("data");

      if (!(rawOuterData instanceof Map)) {
        logger.warn("Received outer data field is not a Map: {}", rawOuterData);
        sendMessage(session,
            new WebSocketMessage("error", Map.of("message", "Invalid data format in message (outer data)")));
        return;
      }

      Map<String, Object> eventDataMap = (Map<String, Object>) rawOuterData;

      Map<String, Object> innerEventData;
      Object rawInnerData = eventDataMap.get("data");

      if ("delete".equals(type)) {
        if (eventDataMap.containsKey("id")) {
          innerEventData = eventDataMap;
        } else if (rawInnerData instanceof Map) {
          innerEventData = (Map<String, Object>) rawInnerData;
        } else {
          logger.warn("Delete message for user {} missing event ID in 'data' or 'data.data'. Payload: {}",
              senderUsername, eventDataMap);
          sendMessage(session, new WebSocketMessage("error", Map.of("message", "Event ID missing for delete.")));
          return;
        }
      } else {
        if (!(rawInnerData instanceof Map)) {
          logger.warn("Received inner event data field is not a Map: {}. Outer data: {}", rawInnerData, eventDataMap);
          sendMessage(session, new WebSocketMessage("error", Map.of("message", "Invalid event data structure.")));
          return;
        }
        innerEventData = (Map<String, Object>) rawInnerData;
      }

      Map<String, Object> eventContentForBroadcast;

      switch (type) {
        case "add":
          if (!innerEventData.containsKey("id") || innerEventData.get("id") == null
              || ((String) innerEventData.get("id")).isEmpty()) {
            logger.warn("Add message missing event ID in inner data for user {}: {}", senderUsername, innerEventData);
            sendMessage(session,
                new WebSocketMessage("error", Map.of("message", "Event ID missing in 'data.data' for add.")));
            return;
          }
          String newEventId = (String) innerEventData.get("id");

          Event newEvent = new Event();
          newEvent.setId(newEventId);

          Project projectRefAdd = new Project();
          projectRefAdd.setId(projectId);
          newEvent.setProject(projectRefAdd);

          newEvent.setData(objectMapper.writeValueAsString(innerEventData));
          Event savedEvent = eventRepository.save(newEvent);

          eventContentForBroadcast = new HashMap<>(innerEventData);

          broadcastToProject(projectId, senderUsername,
              new WebSocketMessage(type, Map.of("data", eventContentForBroadcast, "username", senderUsername)));
          break;

        case "update":
          System.out.println("eventDataMap (outer) = " + eventDataMap);
          System.out.println("innerEventData = " + innerEventData);

          if (!innerEventData.containsKey("id") || innerEventData.get("id") == null
              || ((String) innerEventData.get("id")).isEmpty()) {
            logger.warn("Update message missing event ID in inner data for user {}: {}", senderUsername,
                innerEventData);
            sendMessage(session,
                new WebSocketMessage("error", Map.of("message", "Event ID missing in 'data.data' for update.")));
            return;
          }
          String eventIdUpdate = (String) innerEventData.get("id");
          Optional<Event> existingEventOpt = eventRepository.findById(eventIdUpdate);

          if (existingEventOpt.isPresent()) {
            Event eventToUpdate = existingEventOpt.get();
            if (!eventToUpdate.getProject().getId().equals(projectId)) {
              logger.warn("User {} attempted to update event {} not belonging to project {}", senderUsername,
                  eventIdUpdate, projectId);
              sendMessage(session,
                  new WebSocketMessage("error", Map.of("message", "Permission denied to update event.")));
              return;
            }

            eventToUpdate.setData(objectMapper.writeValueAsString(innerEventData));

            Project projectRefUpdate = new Project();
            projectRefUpdate.setId(projectId);
            eventToUpdate.setProject(projectRefUpdate);

            Event updatedEvent = eventRepository.save(eventToUpdate);

            eventContentForBroadcast = new HashMap<>(innerEventData);

            broadcastToProject(projectId, senderUsername,
                new WebSocketMessage(type, Map.of("data", eventContentForBroadcast, "username", senderUsername)));
          } else {
            logger.warn("Event with ID {} not found for update by user {}.", eventIdUpdate, senderUsername);
            sendMessage(session, new WebSocketMessage("error", Map.of("message", "Event not found for update.")));
          }
          break;

        case "delete":
          if (!innerEventData.containsKey("id") || innerEventData.get("id") == null
              || ((String) innerEventData.get("id")).isEmpty()) {
            logger.warn("Delete message missing event ID for user {}: {}", senderUsername, innerEventData);
            sendMessage(session, new WebSocketMessage("error", Map.of("message", "Event ID missing for delete.")));
            return;
          }
          String eventIdDelete = (String) innerEventData.get("id");

          Optional<Event> eventToDeleteOpt = eventRepository.findById(eventIdDelete);
          if (eventToDeleteOpt.isPresent()) {
            Event eventToDelete = eventToDeleteOpt.get();
            if (!eventToDelete.getProject().getId().equals(projectId)) {
              logger.warn("User {} attempted to delete event {} not belonging to project {}", senderUsername,
                  eventIdDelete, projectId);
              sendMessage(session,
                  new WebSocketMessage("error", Map.of("message", "Permission denied to delete event.")));
              return;
            }
            eventRepository.deleteById(eventIdDelete);
            Map<String, Object> deleteConfirmationData = Map.of("id", eventIdDelete);
            broadcastToProject(projectId, senderUsername,
                new WebSocketMessage(type, Map.of("data", deleteConfirmationData, "username", senderUsername)));
          } else {
            logger.warn("Event with ID {} not found for deletion by user {}", eventIdDelete, senderUsername);
            sendMessage(session, new WebSocketMessage("error", Map.of("message", "Event not found for deletion.")));
          }
          break;
        default:
          logger.warn("Unknown event type received from user {}: {}", senderUsername, type);

          break;
      }
    } catch (Exception e) {
      logger.error("Error processing WebSocket message from user {}: {}", senderUsername, e.getMessage(), e);
      sendMessage(session, new WebSocketMessage("error", Map.of("message", "Invalid message format or server error")));
    }
  }

  private void broadcastToProject(Long projectId, String senderUsername, WebSocketMessage message) {
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

  public void broadcastToAllInProject(Long projectId, WebSocketMessage message) {
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

  private void sendMessage(WebSocketSession session, WebSocketMessage message) {
    try {
      if (session.isOpen()) {
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
      }
    } catch (IOException e) {
      logger.error("Error sending message to WebSocket client {}: {}", session.getId(), e.getMessage());
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
        logger.info("User {} removed from project {} sessions.", username, projectId);

        if (sessions.isEmpty()) {
          projectSessions.remove(projectId);
          logger.info("Project {} has no more active sessions, removing from map.", projectId);
        } else {
          WebSocketMessage userLeftMessage = new WebSocketMessage("user_left", Map.of(
              "username", username,
              "activeUsers", getActiveUsers(projectId)));

          broadcastToAllInProject(projectId, userLeftMessage);
        }
      }
    }
    logger.info("WebSocket connection closed for user {} in project {}, session id: {}, reason: {}", username,
        projectId, session.getId(), status);
  }

  @Override
  public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
    logger.error("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage(), exception);
    String username = (String) session.getAttributes().get("username");
    Long projectId = (Long) session.getAttributes().get("projectId");

    if (username != null && projectId != null) {
      ConcurrentHashMap<String, WebSocketSession> sessions = projectSessions.get(projectId);
      if (sessions != null) {
        sessions.remove(username, session);
        logger.info("User {} removed from project {} sessions due to transport error.", username, projectId);
        if (sessions.isEmpty()) {
          projectSessions.remove(projectId);
          logger.info("Project {} has no more active sessions after transport error, removing from map.", projectId);
        } else {
          WebSocketMessage userLeftMessage = new WebSocketMessage("user_left", Map.of(
              "username", username,
              "activeUsers", getActiveUsers(projectId)));
          broadcastToAllInProject(projectId, userLeftMessage);
        }
      }
    }
  }

  private List<String> getActiveUsers(Long projectId) {
    ConcurrentHashMap<String, WebSocketSession> sessions = projectSessions.get(projectId);
    if (sessions != null) {
      return new ArrayList<>(sessions.keySet());
    }
    return Collections.emptyList();
  }
}