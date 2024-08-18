"use server";

import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInWithDiscord({pathname = "/"}: {pathname: string}) {
  const supabase = createClient();


  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: getURL(`/auth/callback?next=${pathname}`),
    },
  });

  if (error) {
    console.error("Error signing in with Discord", error.message);
    return;
  }

  if (data.url) {
    revalidatePath(data.url, "layout");
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out", error.message);
  }

  revalidatePath("/", "layout");
}
