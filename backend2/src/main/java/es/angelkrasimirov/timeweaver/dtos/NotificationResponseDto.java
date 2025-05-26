package es.angelkrasimirov.timeweaver.dtos;

import java.time.LocalDateTime;

public class NotificationResponseDto {
    private Long id;
    private String username;
    private String eventName;
    private Object data;
    private LocalDateTime timestamp;
    private boolean readStatus;

    public NotificationResponseDto(Long id, String username, String eventName, Object data, LocalDateTime timestamp,
            boolean readStatus) {
        this.id = id;
        this.username = username;
        this.eventName = eventName;
        this.data = data;
        this.timestamp = timestamp;
        this.readStatus = readStatus;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEventName() {
        return eventName;
    }

    public Object getData() {
        return data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public boolean isReadStatus() {
        return readStatus;
    }
}