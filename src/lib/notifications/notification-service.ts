export type NotificationPayload = {
  to?: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
};

export interface NotificationChannel {
  send(payload: NotificationPayload): Promise<void>;
}

export class EmailNotificationChannel implements NotificationChannel {
  async send(payload: NotificationPayload) {
    if (!process.env.SMTP_HOST) return;
    console.info("Email notification queued", payload.title, payload.to);
  }
}

export class NotificationService {
  constructor(private readonly channels: NotificationChannel[] = [new EmailNotificationChannel()]) {}

  async notify(payload: NotificationPayload) {
    await Promise.all(this.channels.map((channel) => channel.send(payload)));
  }
}

export const notificationService = new NotificationService();
