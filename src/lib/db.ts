import "server-only";

import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url && process.env.NODE_ENV !== "development") {
  // eslint-disable-next-line no-console
  console.warn("[db] DATABASE_URL not set — DB-backed actions will fail.");
}

export const sql = postgres(url ?? "postgres://invalid", {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export type Subscriber = {
  id: number;
  email: string;
  status: "active" | "unsubscribed";
  created_at: Date;
};

export type NewsletterPost = {
  id: number;
  slug: string;
  title: string;
  body: string;
  sent_at: Date | null;
  recipients_count: number | null;
  created_at: Date;
};
