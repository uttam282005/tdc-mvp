import { type NextRequest } from "next/server";
import { db, notes } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");

  if (!profileId) {
    return Response.json({ error: "profileId is required" }, { status: 400 });
  }

  try {
    const existingNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.profileId, profileId))
      .limit(1);

    return Response.json({ content: existingNotes[0]?.content || "" });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return Response.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { profileId, content } = (await request.json()) as {
      profileId?: string;
      content?: string;
    };

    if (!profileId || content === undefined) {
      return Response.json({ error: "profileId and content are required" }, { status: 400 });
    }

    // Check if a note already exists
    const existingNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.profileId, profileId))
      .limit(1);

    if (existingNotes.length > 0) {
      // Update
      await db
        .update(notes)
        .set({ content, updatedAt: new Date() })
        .where(eq(notes.profileId, profileId));
    } else {
      // Insert
      await db.insert(notes).values({
        profileId,
        content,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to save note:", error);
    return Response.json({ error: "Failed to save note" }, { status: 500 });
  }
}
