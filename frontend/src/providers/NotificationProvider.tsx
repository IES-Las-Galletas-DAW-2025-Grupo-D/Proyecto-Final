import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useAuth } from "./AuthProvider";
import { Notification } from "../types/notification"; // Ensure this path is correct
import { toApiUrl } from "../utils/api"; // Ensure this path is correct

interface NotificationContextType {
  notifications: Notification[];
  markNotificationAsRead: (notificationId: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { getToken, isAuthenticated } = useAuth();
  const [activeEventSource, setActiveEventSource] =
    useState<EventSourcePolyfill | null>(null);

  const fetchInitialNotifications = useCallback(async (token: string) => {
    try {
      const response = await fetch(toApiUrl("/notifications"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const initialNotifications = (await response.json()) as Notification[];
        setNotifications(initialNotifications);
      } else {
        console.error(
          "Failed to fetch initial notifications:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching initial notifications:", error);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    const authenticated = isAuthenticated();

    let eventSourceInstanceInThisEffect: EventSourcePolyfill | null = null;

    const handleNotificationData = (eventData: string, eventType?: string) => {
      try {
        const newNotification = JSON.parse(eventData) as Notification;
        setNotifications((prevNotifications) => {
          if (prevNotifications.some((n) => n.id === newNotification.id)) {
            return prevNotifications;
          }
          return [...prevNotifications, newNotification];
        });
      } catch (error) {
        console.error(
          `Error parsing ${eventType || "generic"} notification data:`,
          error,
          "Raw data:",
          eventData
        );
      }
    };

    const projectInvitationHandler = (event: Event) => {
      console.log("Received project_invitation event:", event.data);
      handleNotificationData(event.data, "project_invitation");
    };
    const invitationAcceptedHandler = (event: MessageEvent) => {
      console.log("Received invitation_accepted event:", event.data);
      handleNotificationData(event.data, "invitation_accepted");
    };
    const invitationDeclinedHandler = (event: MessageEvent) => {
      console.log("Received invitation_declined event:", event.data);
      handleNotificationData(event.data, "invitation_declined");
    };
    const generalNotificationHandler = (event: MessageEvent) => {
      console.log("Received general 'notification' event:", event.data);
      handleNotificationData(event.data, "notification");
    };

    if (authenticated && token) {
      if (activeEventSource) {
        activeEventSource.close();
        setActiveEventSource(null);
      }

      fetchInitialNotifications(token);

      const sseUrl = toApiUrl("/notifications/subscribe");
      eventSourceInstanceInThisEffect = new EventSourcePolyfill(sseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 120_000,
      });

      eventSourceInstanceInThisEffect.onopen = () => {
        console.log("EventSource connection opened.");
      };

      // General message handler (for messages without a specific event name)
      eventSourceInstanceInThisEffect.onmessage = (event) => {
        console.log("Generic SSE message received (onmessage):", event.data);
        // Decide if you want to process these as notifications too, or if they are for other purposes.
        // handleNotificationData(event.data, 'generic onmessage');
      };

      // Specific event listeners

      eventSourceInstanceInThisEffect.addEventListener(
        "project_invitation",
        (event) => projectInvitationHandler(event as MessageEvent)
      );
      eventSourceInstanceInThisEffect.addEventListener(
        "invitation_accepted",
        (event) => invitationAcceptedHandler(event as MessageEvent)
      );
      eventSourceInstanceInThisEffect.addEventListener(
        "invitation_declined",
        (event) => invitationDeclinedHandler(event as MessageEvent)
      );
      eventSourceInstanceInThisEffect.addEventListener(
        "notification",
        (event) => generalNotificationHandler(event as MessageEvent)
      );

      eventSourceInstanceInThisEffect.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSourceInstanceInThisEffect?.close();
        setActiveEventSource((prev) =>
          prev === eventSourceInstanceInThisEffect ? null : prev
        );
      };

      setActiveEventSource(
        eventSourceInstanceInThisEffect as EventSourcePolyfill
      );
    } else {
      if (activeEventSource) {
        console.log("Closing EventSource due to auth change or logout.");
        activeEventSource.close();
        setActiveEventSource(null);
      }
    }

    return () => {
      if (eventSourceInstanceInThisEffect) {
        console.log("Cleaning up EventSource instance from effect return.");
        eventSourceInstanceInThisEffect.removeEventListener(
          "project_invitation",
          (event) => projectInvitationHandler(event as MessageEvent)
        );
        eventSourceInstanceInThisEffect.removeEventListener(
          "invitation_accepted",
          (event) => invitationAcceptedHandler(event as MessageEvent)
        );
        eventSourceInstanceInThisEffect.removeEventListener(
          "invitation_declined",
          (event) => invitationDeclinedHandler(event as MessageEvent)
        );
        eventSourceInstanceInThisEffect.removeEventListener(
          "notification",
          (event) => generalNotificationHandler(event as MessageEvent)
        );
        eventSourceInstanceInThisEffect.close();
        setActiveEventSource((prev) =>
          prev === eventSourceInstanceInThisEffect ? null : prev
        );
      }
    };
  }, [getToken, isAuthenticated, fetchInitialNotifications]);

  const markNotificationAsRead = useCallback(
    async (notificationId: number) => {
      const token = getToken();
      if (!token) {
        console.error("No token available to mark notification as read.");
        return;
      }
      try {
        const response = await fetch(
          toApiUrl(`/notifications/${notificationId}`),
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification.id !== notificationId
            )
          );
        } else {
          console.error(
            "Failed to mark notification as read:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [getToken]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, markNotificationAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
