"use server";

import { createClient } from "@/lib/supabase/server";

export async function addNikke(data) {
  const supabase = createClient();

  const { error } = await supabase.from("nikkes").insert(data);

  if (error) {
    throw new Error("Failed to add Nikke");
  }

  return { success: true };
}

export async function updateNikke(id, data) {
  const supabase = createClient();

  const { error } = await supabase.from("nikkes").update(data).eq("id", id);

  if (error) {
    throw new Error("Failed to update Nikke");
  }

  return { success: true };
}

export async function deleteNikke(id) {
  const supabase = createClient();

  const { error } = await supabase.from("nikkes").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete Nikke");
  }

  return { success: true };
}

export async function getNikkes() {
  const supabase = createClient();

  const { data, error } = await supabase.from("nikkes").select("*");

  if (error) {
    throw new Error("Failed to fetch Nikkes");
  }

  return data;
}
