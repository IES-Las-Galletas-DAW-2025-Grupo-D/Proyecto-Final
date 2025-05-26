package es.angelkrasimirov.timeweaver.services;

import es.angelkrasimirov.timeweaver.models.Notification;
import es.angelkrasimirov.timeweaver.repositories.NotificationRepository;
import es.angelkrasimirov.timeweaver.dtos.NotificationResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class NotificationService {
  private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
  private static final int MAX_CONNECTIONS_PER_USER = 5;

  private final Map<String, Map<String, Connection>> emitters = new ConcurrentHashMap<>();
  private final NotificationRepository notificationRepository;
  private final ObjectMapper objectMapper;

  @Autowired
  public NotificationService(NotificationRepository notificationRepository, ObjectMapper objectMapper) {
    this.notificationRepository = notificationRepository;
    this.objectMapper = objectMapper;
  }

  private static class Connection {
    final SseEmitter emitter;
    final long creationTime;

    Connection(SseEmitter emitter) {
      this.emitter = emitter;
      this.creationTime = System.currentTimeMillis();
    }
  }

  public SseEmitter createEmitter(String username) {
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
    String emitterId = UUID.randomUUID().toString();

    emitter.onCompletion(() -> removeEmitter(username, emitterId));
    emitter.onTimeout(() -> removeEmitter(username, emitterId));
    emitter.onError(e -> {
      logger.error("SSE error for user {}, emitterId {}: {}", username, emitterId, e.getMessage());
      removeEmitter(username, emitterId);
    });

    Map<String, Connection> userConnections = emitters.computeIfAbsent(username, k -> new ConcurrentHashMap<>());

    if (userConnections.size() >= MAX_CONNECTIONS_PER_USER) {
      String oldestEmitterId = Collections
          .min(userConnections.entrySet(), Comparator.comparingLong(e -> e.getValue().creationTime)).getKey();
      removeEmitter(username, oldestEmitterId);
    }

    userConnections.put(emitterId, new Connection(emitter));

    try {

      emitter.send(SseEmitter.event()
          .name("connect")
          .data(Map.of(
              "message", "Connected to notification stream",
              "connectionId", emitterId,
              "timestamp", System.currentTimeMillis())));
    } catch (IOException e) {
      logger.error("Error sending initial SSE message to user {}, emitterId {}: {}",
          username, emitterId, e.getMessage());
      removeEmitter(username, emitterId);
    }

    logger.info("SSE connection established for user: {}, emitterId: {}", username, emitterId);
    return emitter;
  }

  public void removeEmitter(String username, String emitterId) {
    Map<String, Connection> userConnections = emitters.get(username);
    if (userConnections != null) {
      Connection connection = userConnections.remove(emitterId);
      if (connection != null) {
        connection.emitter.complete();
        logger.info("SSE connection closed for user: {}, emitterId: {}", username, emitterId);
      }

      if (userConnections.isEmpty()) {
        emitters.remove(username);
        logger.info("Removed all SSE connections for user: {}", username);
      }
    }
  }

  public void removeAllEmitters(String username) {
    Map<String, Connection> userConnections = emitters.remove(username);
    if (userConnections != null) {
      userConnections.values().forEach(connection -> connection.emitter.complete());
      logger.info("Closed all SSE connections for user: {}, count: {}",
          username, userConnections.size());
    }
  }

  public void sendNotificationToUser(String username, String eventName, Object data) {
    Notification savedNotification = null;
    try {
      String jsonData = objectMapper.writeValueAsString(data);
      Notification notification = Notification.builder()
          .username(username)
          .eventName(eventName)
          .data(jsonData)
          .timestamp(LocalDateTime.now())
          .readStatus(false)
          .build();
      savedNotification = notificationRepository.save(notification);
      logger.info("Notification persisted for user: {}, event: {}", username, eventName);
    } catch (Exception e) {
      logger.error("Error persisting notification for user {}: {}", username, e.getMessage(), e);

    }

    Map<String, Connection> userConnections = emitters.get(username);
    if (userConnections != null && !userConnections.isEmpty()) {
      Set<String> deadEmitterIds = ConcurrentHashMap.newKeySet();

      NotificationResponseDto sseDto;
      if (savedNotification != null) {
        sseDto = new NotificationResponseDto(
            savedNotification.getId(),
            savedNotification.getUsername(),
            savedNotification.getEventName(),
            data,
            savedNotification.getTimestamp(),
            savedNotification.isReadStatus());
      } else {

        sseDto = new NotificationResponseDto(
            null,
            username,
            eventName,
            data,
            LocalDateTime.now(),
            false);
        logger.warn("Sending SSE for user {} event {} without persisted ID due to prior error.", username, eventName);
      }

      userConnections.forEach((emitterId, connection) -> {
        try {
          connection.emitter.send(SseEmitter.event()
              .name(eventName)
              .data(sseDto));
        } catch (IOException e) {
          logger.error("Error sending SSE event to user {}, emitterId {}: {}",
              username, emitterId, e.getMessage());
          deadEmitterIds.add(emitterId);
        }
      });

      deadEmitterIds.forEach(emitterId -> removeEmitter(username, emitterId));
    }
  }

  public void sendNotificationToAll(String eventName, Object data) {

    NotificationResponseDto broadcastDto = new NotificationResponseDto(
        null,
        "broadcast",
        eventName,
        data,
        LocalDateTime.now(),
        false);

    emitters.forEach((username, userConnections) -> {
      Set<String> deadEmitterIds = ConcurrentHashMap.newKeySet();
      userConnections.forEach((emitterId, connection) -> {
        try {
          connection.emitter.send(SseEmitter.event()
              .name(eventName)
              .data(broadcastDto));
        } catch (IOException e) {
          logger.error("Error sending broadcast SSE event to user {}, emitterId {}: {}",
              username, emitterId, e.getMessage());
          deadEmitterIds.add(emitterId);
        }
      });
      deadEmitterIds.forEach(emitterId -> removeEmitter(username, emitterId));
    });
  }

  public int getActiveUserCount() {
    return emitters.size();
  }

  public int getActiveConnectionCount() {
    return emitters.values().stream()
        .mapToInt(Map::size)
        .sum();
  }

  public int getUserConnectionCount(String username) {
    Map<String, Connection> userConnections = emitters.get(username);
    return userConnections != null ? userConnections.size() : 0;
  }

  public List<NotificationResponseDto> getUnreadNotificationsForUser(String username) {
    List<Notification> notifications = notificationRepository
        .findByUsernameAndReadStatusFalseOrderByTimestampDesc(username);
    return notifications.stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  private NotificationResponseDto convertToDto(Notification notification) {
    Object deserializedData = null;
    if (notification.getData() != null && !notification.getData().isEmpty()) {
      try {

        deserializedData = objectMapper.readValue(notification.getData(), Object.class);
      } catch (JsonProcessingException e) {
        logger.warn("Failed to parse notification data as JSON for notification id {}. Returning raw string. Error: {}",
            notification.getId(), e.getMessage());
        deserializedData = notification.getData();
      }
    }
    return new NotificationResponseDto(
        notification.getId(),
        notification.getUsername(),
        notification.getEventName(),
        deserializedData,
        notification.getTimestamp(),
        notification.isReadStatus());
  }

  public void markNotificationAsRead(Long notificationId, String username) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

    if (!notification.getUsername().equals(username)) {
      logger.warn("User {} attempted to mark notification {} as read, but it belongs to {}", username, notificationId,
          notification.getUsername());
      throw new SecurityException("User does not have permission to mark this notification as read.");
    }

    notificationRepository.deleteById(notificationId);
    logger.info("Notification {} removed for user {}", notificationId, username);
  }
}