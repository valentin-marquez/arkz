import type { MetadataRoute } from "next";
import { getURL } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { get } from "http";

async function getManufacturerSites(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tribe_towers")
    .select("manufacturer, max_floors");

  if (error) {
    console.error(error);
    return [];
  }

  // now y need return an array of objects like this:
  // { url: getUrl(`/${manufacturer}/${floor_number}`), lastModified: new Date(), changeFrequency: "daily", priority: 0.8 }
  //  entonces ncestio generar de todas las manufacturer segun el numero de max_floors

  return data.reduce(
    (acc: MetadataRoute.Sitemap, { manufacturer, max_floors }) => {
      for (let i = 1; i <= max_floors; i++) {
        acc.push({
          url: getURL(`/tribe/${manufacturer}/${i}`),
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8,
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

  const { data, error } = await supabase.from("bosses").select("slug");

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
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manufacturerSites = await getManufacturerSites();
  const storySites = await getStorySites();
  const interceptionSites = await getInterceptionSites();

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
  ];

  return [
    ...additionalSites,
    ...manufacturerSites,
    ...storySites,
    ...interceptionSites,
  ];
}
