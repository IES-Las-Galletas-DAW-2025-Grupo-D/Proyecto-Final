package es.angelkrasimirov.timeweaver.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {
  private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
  private static final int MAX_CONNECTIONS_PER_USER = 5;

  private final Map<String, Map<String, Connection>> emitters = new ConcurrentHashMap<>();

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
    Map<String, Connection> userConnections = emitters.get(username);
    if (userConnections != null && !userConnections.isEmpty()) {
      Set<String> deadEmitterIds = ConcurrentHashMap.newKeySet();

      userConnections.forEach((emitterId, connection) -> {
        try {
          connection.emitter.send(SseEmitter.event()
              .name(eventName)
              .data(data));
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
    emitters.forEach((username, userConnections) -> {
      Set<String> deadEmitterIds = ConcurrentHashMap.newKeySet();

      userConnections.forEach((emitterId, connection) -> {
        try {
          connection.emitter.send(SseEmitter.event()
              .name(eventName)
              .data(data));
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
}