import { DataSet, IdType } from "vis-timeline/standalone";
import { TimelineWSEvent, WebSocketMessage } from "../../types/timeline";
import { toWsUrl } from "../../utils/api";

class TimelineWebSocketService {
  private ws: WebSocket | null = null;
  private projectId: string;
  private eventsData: DataSet<TimelineWSEvent>; // The vis-timeline DataSet instance

  // Callbacks for various WebSocket events
  private onConnectedCallback?: () => void;
  private onMessageCallback?: (message: WebSocketMessage) => void;
  private onErrorCallback?: (error: Event) => void;
  private onDisconnectedCallback?: (event: CloseEvent) => void;

  constructor(
    projectId: string,
    eventsData: DataSet<TimelineWSEvent>,
    callbacks?: {
      onConnected?: () => void;
      onMessage?: (message: WebSocketMessage) => void;
      onError?: (error: Event) => void;
      onDisconnected?: (event: CloseEvent) => void;
    }
  ) {
    this.projectId = projectId;
    this.eventsData = eventsData;
    this.onConnectedCallback = callbacks?.onConnected;
    this.onMessageCallback = callbacks?.onMessage;
    this.onErrorCallback = callbacks?.onError;
    this.onDisconnectedCallback = callbacks?.onDisconnected;
  }

  public connect(token: string): void {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      console.warn(
        `WebSocket: Already connected or connecting for project ${this.projectId}.`
      );
      return;
    }

    const url = toWsUrl(`/projects/${this.projectId}?token=${token}`);
    console.log(`WebSocket: Connecting to ${url}`);
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log(`WebSocket: Connected for project ${this.projectId}`);
      this.onConnectedCallback?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as WebSocketMessage;
        console.log("WebSocket: Message received:", message);

        this.onMessageCallback?.(message);

        // Handle direct data manipulation based on message type from server
        switch (message.type) {
          case "initial_data":
            if (Array.isArray(message.payload)) {
              this.eventsData.clear();
              this.eventsData.add(message.payload as TimelineWSEvent[]);
              console.log("WebSocket: Initial data loaded into DataSet.");
            } else {
              console.warn(
                "WebSocket: Received initial_data with invalid payload format.",
                message.payload
              );
            }
            break;
          case "event_added": // Assuming server confirms with 'event_added'
            this.eventsData.add(message.payload as TimelineWSEvent);
            console.log("WebSocket: Event added to DataSet:", message.payload);
            break;
          case "event_updated":
            this.eventsData.update(message.payload as TimelineWSEvent);
            console.log(
              "WebSocket: Event updated in DataSet:",
              message.payload
            );
            break;
          case "event_removed": {
            const idToRemove =
              typeof message.payload === "object" &&
              message.payload !== null &&
              "id" in message.payload
                ? message.payload.id
                : message.payload;
            if (idToRemove) {
              this.eventsData.remove(idToRemove as IdType);
              console.log("WebSocket: Event removed from DataSet:", idToRemove);
            } else {
              console.warn(
                "WebSocket: Received event_removed with invalid payload for ID.",
                message.payload
              );
            }
            break;
          }
          default:
            console.log(
              `WebSocket: Received unhandled message type: ${message.type}`
            );
        }
      } catch (error) {
        console.error(
          "WebSocket: Failed to parse message or handle event:",
          error,
          "Raw data:",
          event.data
        );
      }
    };

    this.ws.onerror = (errorEvent) => {
      console.error(
        `WebSocket: Error for project ${this.projectId}:`,
        errorEvent
      );
      this.onErrorCallback?.(errorEvent);
    };

    this.ws.onclose = (closeEvent) => {
      console.log(
        `WebSocket: Disconnected for project ${this.projectId}. Code: ${closeEvent.code}, Reason: ${closeEvent.reason}, Was Clean: ${closeEvent.wasClean}`
      );
      this.ws = null; // Important to allow reconnection
      this.onDisconnectedCallback?.(closeEvent);
    };
  }

  /**
   * Sends a generic message to the WebSocket server.
   */
  public sendMessage(message: WebSocketMessage): void {
    console.log(this.ws);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      console.log("WebSocket: Message sent:", message);
    } else {
      console.error("WebSocket: Not connected. Cannot send message:", message);
      // Optionally, queue messages or attempt to reconnect
    }
  }

  /**
   * Requests the server to add a new timeline event.
   * The server should respond with an 'event_added' message including the final event data (e.g., with server-generated ID).
   */
  public requestAddTimelineEvent(eventData: Omit<TimelineWSEvent, "id">): void {
    this.sendMessage({
      type: "add_event_request",
      payload: eventData,
    });
  }

  /**
   * Requests the server to update an existing timeline event.
   */
  public requestUpdateTimelineEvent(eventData: TimelineWSEvent): void {
    this.sendMessage({
      type: "update_event_request",
      payload: eventData,
    });
  }

  /**
   * Requests the server to remove a timeline event by its ID.
   */
  public requestRemoveTimelineEvent(eventId: IdType): void {
    this.sendMessage({
      type: "remove_event_request",
      payload: { id: eventId },
    });
  }

  public close(): void {
    if (this.ws) {
      console.log(
        `WebSocket: Closing connection for project ${this.projectId}`
      );
      this.ws.close(1000, "Client initiated disconnect"); // Standard close code
    }
  }

  public getIsConnected(): boolean {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export default TimelineWebSocketService;
