package es.angelkrasimirov.timeweaver.dtos;

import java.util.HashMap;
import java.util.Map;

public class WebSocketMessage {
    private String type;
    private Map<String, Object> data;

    public WebSocketMessage(String type, Map<String, Object> data) {
        this.type = type;
        if (data != null) {
            this.data = new HashMap<>(data);
            if (!this.data.containsKey("timestamp")) {
                this.data.put("timestamp", System.currentTimeMillis());
            }
        } else {
            this.data = new HashMap<>();
            this.data.put("timestamp", System.currentTimeMillis());
        }
    }

    public String getType() {
        return type;
    }

    public Object getData() {
        return data;
    }
}
