import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";
import type { MetadataRoute } from "next";

async function getManufacturerSites(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tribe_towers")
    .select("manufacturer, max_floors");

  if (error) {
    console.error(error);
    return [];
  }

  return data.reduce(
    (acc: MetadataRoute.Sitemap, { manufacturer, max_floors }) => {
      for (let i = 1; i <= max_floors; i++) {
        acc.push({
          url: getURL(`/tribe/${manufacturer}/${i}`),
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8 - (i / max_floors) * 0.3,
        });
      }
      return acc;
    },
    []
  );
}

async function getStorySites(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("chapters")
    .select("chapter_number, difficulty");

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(({ chapter_number, difficulty }) => ({
    url: getURL(`/story/${difficulty}/${chapter_number}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));
}

async function getInterceptionSites(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bosses")
    .select("slug")
    .eq("mode_type", "Interception");

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(({ slug }) => ({
    url: getURL(`/interception/${slug}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));
}

async function getAnomalyInterceptionSites(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bosses")
    .select("slug")
    .eq("mode_type", "Anomaly Interception");

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(({ slug }) => ({
    url: getURL(`/interception/${slug}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));
}

async function getSoloRaidSites(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("solo_raid_seasons")
    .select("slug");

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(({ slug }) => ({
    url: getURL(`/solo-raid/${slug}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manufacturerSites = await getManufacturerSites();
  const storySites = await getStorySites();
  const interceptionSites = await getInterceptionSites();
  const soloRaidSites = await getSoloRaidSites();

  const additionalSites: MetadataRoute.Sitemap = [
    {
      url: getURL(),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: getURL("/interceptions"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getURL("/story"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getURL("/solo-raid"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [
    ...additionalSites,
    ...manufacturerSites,
    ...storySites,
    ...interceptionSites,
    ...soloRaidSites,
  ];
}
