import { DataItem } from "vis-timeline/standalone";

export interface TimelineWSEvent extends DataItem {
  details?: string;
}

export interface WebSocketMessage {
  type: string;
  data:
    | WsMessagePayloadConnectionSuccess
    | WsMessagePayloadUserJoined
    | WsMessagePayloadError
    | WsMessagePayloadAction;
}

interface WebSocketMessagePayload {
  timestamp: number;
}

export interface WsMessagePayloadConnectionSuccess
  extends WebSocketMessagePayload,
    WsMessagePayloadUserJoined {
  projectId: number;
  projectEvents: TimelineWSEvent[];
}

export interface WsMessagePayloadUserJoined extends WebSocketMessagePayload {
  username: string;
  activeUsers: string[];
}

export interface WsMessagePayloadError extends WebSocketMessagePayload {
  message: string;
}

export interface WsMessagePayloadAction extends WebSocketMessagePayload {
  data: unknown;
}
