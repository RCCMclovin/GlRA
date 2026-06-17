import { Notification } from "../../generated/prisma/client";

export type NotificationDTO = Pick<Notification, 'content' | 'read'>;