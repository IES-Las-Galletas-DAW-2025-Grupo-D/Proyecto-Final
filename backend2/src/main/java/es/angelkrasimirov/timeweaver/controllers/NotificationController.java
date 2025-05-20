package es.angelkrasimirov.timeweaver.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import es.angelkrasimirov.timeweaver.dtos.CustomNotificationDto;
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
}