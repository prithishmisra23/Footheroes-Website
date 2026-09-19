export interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  uploadedAt: string;
  entityId: string; // playerId, teamId, matchId etc
  entityType: "PLAYER" | "TEAM" | "MATCH" | "TOURNAMENT";
}

export const mockMedia: MediaItem[] = [
  {
    id: "md_001",
    type: "IMAGE",
    url: "/media/placeholder_1.jpg",
    title: "Match action",
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    entityId: "p_001",
    entityType: "PLAYER"
  },
  {
    id: "md_002",
    type: "VIDEO",
    url: "/media/video_1.mp4",
    thumbnailUrl: "/media/thumb_1.jpg",
    title: "Free kick goal",
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    entityId: "p_001",
    entityType: "PLAYER"
  }
];
