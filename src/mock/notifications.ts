import { Notification } from "@/types";
export type { Notification };

export const mockNotifications: Notification[] = [
  {
    id: "n_001",
    userId: "u_001",
    type: "GOAL",
    title: "Goal Scored!",
    message: "Rahul Sharma scored for Delhi FC against Mumbai Strikers in the 67th minute.",
    isRead: false,
    read: false,
    createdAt: new Date().toISOString(),
    link: "/match/m_001",
    actionUrl: "/match/m_001"
  },
  {
    id: "n_002",
    userId: "u_001",
    type: "SCOUT_VIEW",
    title: "Profile Viewed",
    message: "A verified scout from Bengaluru FC viewed your profile today.",
    isRead: true,
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];
