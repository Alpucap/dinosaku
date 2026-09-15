import { cookies } from "next/headers";
import { DUMMY_USERS, type User } from "@/lib/data/dummy-users";

export const SESSION_COOKIE = "dinosaku_session";

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  return DUMMY_USERS.find((u) => u.id === sessionId) ?? null;
}
