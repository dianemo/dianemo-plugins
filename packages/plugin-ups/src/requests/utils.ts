export type UpsClientGroup = "forwarding";

export const upsSubClient = (clientName: string, group: UpsClientGroup) =>
  `${clientName}:${group}`;
