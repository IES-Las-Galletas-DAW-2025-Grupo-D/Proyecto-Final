import { DataItem } from "vis-timeline/standalone";

export interface TimelineWSEvent extends DataItem {
  details?: string;
}

export interface WebSocketMessage {
  type: string;
  payload: unknown;
}
