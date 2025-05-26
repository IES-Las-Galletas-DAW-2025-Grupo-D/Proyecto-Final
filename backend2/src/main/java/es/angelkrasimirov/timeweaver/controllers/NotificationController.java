package es.angelkrasimirov.timeweaver.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import es.angelkrasimirov.timeweaver.dtos.CustomNotificationDto;
import es.angelkrasimirov.timeweaver.dtos.NotificationResponseDto;
import es.angelkrasimirov.timeweaver.services.NotificationService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class NotificationController {

  @Autowired
  private NotificationService notificationService;

  @GetMapping(value = "/notifications/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter subscribe(Authentication authentication) {
    String username = authentication.getName();
    return notificationService.createEmitter(username);
  }

  @PostMapping("/notifications/broadcast")
  public void broadcastMessage(@Valid @RequestBody CustomNotificationDto notificationDto) {
    notificationService.sendNotificationToAll(
        notificationDto.getName(),
        Map.of(
            "message", notificationDto.getData(),
            "timestamp", System.currentTimeMillis()));
  }

  @GetMapping("/notifications")
  public ResponseEntity<List<NotificationResponseDto>> getMyNotifications(Authentication authentication) {
    String username = authentication.getName();
    List<NotificationResponseDto> notifications = notificationService.getUnreadNotificationsForUser(username);
    return ResponseEntity.ok(notifications);
  }

  @DeleteMapping("/notifications/{notificationId}")
  public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId, Authentication authentication) {
    String username = authentication.getName();
    try {
      notificationService.markNotificationAsRead(notificationId, username);
      return ResponseEntity.noContent().build();
    } catch (SecurityException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }
}