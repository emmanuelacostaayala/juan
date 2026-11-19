import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { getWelcomeMessage, getWelcomeSentToExistingAt } from "@/lib/welcome";
import { getExclusiveVideo } from "@/lib/video-settings";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";
// Allow newsletter sends to take up to 60s — covers ~240 recipients at the
// 250ms throttle. For larger lists, switch to a transactional email service.
export const maxDuration = 60;

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const subRows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM subscribers WHERE status = 'active'
  `;
  const subscribers = subRows[0]?.count ?? 0;

  const posts = await sql<
    {
      id: number;
      slug: string;
      title: string;
      sent_at: Date | null;
      recipients_count: number | null;
      created_at: Date;
    }[]
  >`
    SELECT id, slug, title, sent_at, recipients_count, created_at
    FROM newsletter_posts
    ORDER BY created_at DESC
    LIMIT 30
  `;

  const welcome = await getWelcomeMessage();
  const welcomeSentAt = await getWelcomeSentToExistingAt();
  const ev = await getExclusiveVideo();

  return (
    <AdminDashboard
      email={session.email}
      subscribers={subscribers}
      posts={posts}
      welcome={welcome}
      welcomeSentAt={welcomeSentAt}
      video={{ id: ev.id, title: ev.title }}
    />
  );
}
