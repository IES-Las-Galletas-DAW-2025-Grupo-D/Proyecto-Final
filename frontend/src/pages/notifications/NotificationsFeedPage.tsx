import React from "react";
import { useNotifications } from "../../providers/NotificationProvider";
import {
  Notification,
  Data as NotificationData,
} from "../../types/notification"; // Assuming notification.d.ts is resolved
import { ProjectRole } from "../../types/projectRole.enum";
import {
  acceptProjectInvitation,
  declineProject,
} from "../../services/projects/ProjectService";
// import { useAuth } from "../../providers/AuthProvider"; // Not strictly needed if invitedUser.id is sufficient

export const NotificationsFeedPage: React.FC = () => {
  const { notifications, markNotificationAsRead } = useNotifications();
  // const { user } = useAuth(); // If you need the current user's ID for other checks

  const formatDateTime = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "Unknown date";
    try {
      return new Date(dateInput).toLocaleString();
    } catch (e) {
      return String(dateInput);
    }
  };

  const roleOptions = [
    { value: ProjectRole.ROLE_PROJECT_VIEWER, label: "Viewer" },
    { value: ProjectRole.ROLE_PROJECT_CONTRIBUTOR, label: "Contributor" },
    { value: ProjectRole.ROLE_PROJECT_MANAGER, label: "Manager" },
  ];

  const handleAcceptInvitation = async (notification: Notification) => {
    if (
      !notification.data?.project?.id ||
      !notification.data?.invitedUser?.id
    ) {
      console.error("Missing data for accepting invitation:", notification);
      // TODO: Show error toast to user
      return;
    }
    try {
      await acceptProjectInvitation(
        notification.data.invitedUser.id,
        notification.data.project.id
      );
      await markNotificationAsRead(notification.id);
      // TODO: Show success toast to user
    } catch (error) {
      console.error("Failed to accept project invitation:", error);
      // TODO: Show error toast to user
      // Attempt to mark as read even if accept failed, as the invitation might be desynced/invalid
      try {
        await markNotificationAsRead(notification.id);
        console.log(
          "Notification marked as read after accept invitation failure."
        );
      } catch (markReadError) {
        console.error(
          "Failed to mark notification as read after accept invitation failure:",
          markReadError
        );
      }
    }
  };

  const handleDeclineInvitation = async (notification: Notification) => {
    if (
      !notification.data?.project?.id ||
      !notification.data?.invitedUser?.id
    ) {
      console.error("Missing data for declining invitation:", notification);
      // TODO: Show error toast to user
      return;
    }
    try {
      await declineProject(
        notification.data.invitedUser.id,
        notification.data.project.id
      );
      await markNotificationAsRead(notification.id);
      // TODO: Show success toast to user
    } catch (error) {
      console.error("Failed to decline project invitation:", error);
      // TODO: Show error toast to user
      // Attempt to mark as read even if decline failed, as the invitation might be desynced/invalid
      try {
        await markNotificationAsRead(notification.id);
        console.log(
          "Notification marked as read after decline invitation failure."
        );
      } catch (markReadError) {
        console.error(
          "Failed to mark notification as read after decline invitation failure:",
          markReadError
        );
      }
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      // TODO: Show success toast to user
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // TODO: Show error toast to user
    }
  };

  const getNotificationTitle = (eventName: string | undefined): string => {
    if (eventName === "project_invitation") {
      return "Project Invitation";
    } else if (eventName === "invitation_accepted") {
      return "Invitation Accepted";
    } else if (eventName === "invitation_declined") {
      return "Invitation Declined";
    }
    // Add more cases for other event names if needed
    return eventName
      ? `Notification: ${eventName.replace(/_/g, " ")}`
      : "Notification";
  };

  const getNotificationTimestamp = (
    data: NotificationData | undefined,
    timestamp: Date | string | undefined
  ): string | Date | undefined => {
    return data?.createdAt || timestamp;
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <p className="text-center">You have no new notifications.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: Notification) => (
            <div key={notification.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-lg">
                  {getNotificationTitle(notification.eventName)}
                </h2>
                {notification.eventName === "project_invitation" &&
                notification.data ? (
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                          notification.data.inviterUser.username
                        )}`}
                        alt={`${notification.data.inviterUser.username}'s avatar`}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-semibold">
                        {notification.data.inviterUser.username}
                      </span>
                    </span>
                    invited you to join project{" "}
                    <span className="font-semibold">
                      {notification.data.project.name}
                    </span>
                    {" as "}
                    <span className="badge badge-primary badge-sm">
                      {roleOptions.find(
                        (role) => role.value === notification.data.projectRole
                      )?.label || notification.data.projectRole}
                    </span>
                    .
                  </p>
                ) : notification.eventName === "invitation_accepted" &&
                  notification.data ? (
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                          notification.data.invitedUser.username
                        )}`}
                        alt={`${notification.data.invitedUser.username}'s avatar`}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-semibold">
                        {notification.data.invitedUser.username}
                      </span>
                    </span>
                    accepted the invitation from you to join project{" "}
                    <span className="font-semibold">
                      {notification.data.project.name}
                    </span>
                    {" as "}
                    <span className="badge badge-success badge-sm">
                      {roleOptions.find(
                        (role) => role.value === notification.data.projectRole
                      )?.label || notification.data.projectRole}
                    </span>
                    .
                  </p>
                ) : notification.eventName === "invitation_declined" &&
                  notification.data ? (
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                          notification.data.invitedUser.username
                        )}`}
                        alt={`${notification.data.invitedUser.username}'s avatar`}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-semibold">
                        {notification.data.invitedUser.username}
                      </span>
                    </span>
                    declined the invitation from you to join project{" "}
                    <span className="font-semibold">
                      {notification.data.project.name}
                    </span>
                    .
                  </p>
                ) : (
                  <p>
                    {/* Generic message for other notification types */}
                    You have a new notification. (ID: {notification.id})
                    {notification.data && (
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(notification.data, null, 2)}
                      </pre>
                    )}
                  </p>
                )}
                <div className="text-xs text-base-content/70 mt-1 mb-2">
                  Received:{" "}
                  {formatDateTime(
                    getNotificationTimestamp(
                      notification.data,
                      notification.timestamp
                    )
                  )}
                </div>
                <div className="card-actions justify-end">
                  {notification.eventName === "project_invitation" &&
                  notification.data ? (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleAcceptInvitation(notification)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeclineInvitation(notification)}
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
