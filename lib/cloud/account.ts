import type { SupabaseClient, User } from "@supabase/supabase-js";

export type WorkspaceAuthStatus =
  | "loading"
  | "signed-in"
  | "signed-out"
  | "disabled";

export interface WorkspaceProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface WorkspaceHistoryItem {
  id: string;
  title: string;
  summary: string | null;
  kind: "document" | "template";
  updatedAt: string;
  createdAt: string;
}

export interface WorkspaceContentItem extends WorkspaceHistoryItem {
  bodyMarkdown: string;
  themeId: string | null;
  layoutMode: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
}

function normalizeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

export async function fetchWorkspaceAccountSnapshot(
  supabase: SupabaseClient,
  user: User,
) {
  const [profileResult, historyResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("content_items")
      .select("id, title, summary, kind, updated_at, created_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(8),
  ]);

  if (profileResult.error) {
    throw profileResult.error;
  }

  if (historyResult.error) {
    throw historyResult.error;
  }

  const profile: WorkspaceProfile = profileResult.data
    ? {
        id: profileResult.data.id,
        email: profileResult.data.email,
        displayName: profileResult.data.display_name,
        avatarUrl: profileResult.data.avatar_url,
      }
    : {
        id: user.id,
        email: user.email ?? "",
        displayName: null,
        avatarUrl: null,
      };

  const history: WorkspaceHistoryItem[] = (historyResult.data ?? []).map(
    (item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      kind: item.kind,
      updatedAt: item.updated_at,
      createdAt: item.created_at,
    }),
  );

  return { profile, history };
}

export async function fetchWorkspaceContentItem(
  supabase: SupabaseClient,
  user: User,
  id: string,
) {
  const result = await supabase
    .from("content_items")
    .select(
      "id, title, summary, kind, body_markdown, theme_id, layout_mode, tags, metadata, updated_at, created_at",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (result.error) {
    throw result.error;
  }

  const item = result.data;

  const contentItem: WorkspaceContentItem = {
    id: item.id,
    title: item.title,
    summary: item.summary,
    kind: item.kind,
    bodyMarkdown: item.body_markdown,
    themeId: item.theme_id,
    layoutMode: item.layout_mode,
    tags: Array.isArray(item.tags) ? item.tags : [],
    metadata: normalizeMetadata(item.metadata),
    updatedAt: item.updated_at,
    createdAt: item.created_at,
  };

  return contentItem;
}
