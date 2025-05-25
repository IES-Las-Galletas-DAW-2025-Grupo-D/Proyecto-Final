package es.angelkrasimirov.timeweaver.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import es.angelkrasimirov.timeweaver.websockets.JwtWebSocketInterceptor;
import es.angelkrasimirov.timeweaver.websockets.ProjectWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  @Autowired
  private ProjectWebSocketHandler projectWebSocketHandler;

  @Autowired
  private JwtWebSocketInterceptor jwtWebSocketInterceptor;

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(projectWebSocketHandler, "/ws/projects/{projectId}")
        .addInterceptors(jwtWebSocketInterceptor)
        .setAllowedOrigins("*");
  }
}