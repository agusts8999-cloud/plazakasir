import { db } from "@/lib/db";
import { activityLogs } from "@/db/schema";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function logActivity({
  userId: manualUserId,
  action,
  entity,
  details,
}: {
  userId?: string;
  action: string;
  entity?: string;
  details?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    let userId = manualUserId || (session?.user as any)?.id;
    
    // Validate UUID format to prevent Postgres errors (e.g. if user is 'admin-1')
    const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    
    if (userId && !isUuid(userId)) {
      console.warn(`Invalid UUID for userId: ${userId}. Logging as system.`);
      userId = null;
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";

    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: userId || null,
      action,
      entity,
      description: details,
      ipAddress: ip,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
