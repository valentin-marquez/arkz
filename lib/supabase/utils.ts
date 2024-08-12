import { createClient } from "./client";

type Buckets = "media";

export function getMediaURL(path: string, bucket: Buckets = "media"): string {
  const supabase = createClient();

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data?.publicUrl;
}
