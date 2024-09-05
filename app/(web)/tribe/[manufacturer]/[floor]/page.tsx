import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TribeTowerTeamList from "@/components/tribe/tribe-team-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import TribeTowerSubmitTeamModal from "@/components/tribe/tribe-submit-team-modal";
import { fetchTribeTowerData } from "@/app/actions/tribe";
import { Metadata, ResolvingMetadata } from "next";
import { getURL } from "@/lib/utils";
import { Header } from "@/components/ui/header";

export async function generateMetadata({
  params,
}: {
  params: { manufacturer: string; floor: string };
}): Promise<Metadata> {
  const { manufacturer, floor } = params;

  const title =
    manufacturer === "all"
      ? `Arkz - Nikke Tribe Tower Guide | Floor ${floor} Strategy & Team Comps`
      : `Arkz - ${manufacturer} Tribe Tower Guide | Floor ${floor} Strategy & Team Comps`;

  const description =
    manufacturer === "all"
      ? `Master Floor ${floor} of the All Tribe Tower in Nikke: Goddess of Victory. Explore top-tier team compositions and strategies to dominate every battle.`
      : `Conquer Floor ${floor} of the ${manufacturer} Tribe Tower in Nikke: Goddess of Victory. Discover optimal team setups and strategies for guaranteed victory.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getURL(`/tribe/${manufacturer}/${floor}`),
      siteName: "Arkz",
      images: [
        {
          url: getURL("/tribe-tower-og-image.png"),
          width: 1200,
          height: 630,
          alt: `Nikke ${manufacturer} Tribe Tower Floor ${floor} Guide`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getURL("/tribe-tower-og-image.png")],
    },
  };
}

export default async function Page({
  params,
}: {
  params: { manufacturer: string; floor: string };
}) {
  const { manufacturer, floor } = params;
  const floorNumber = parseInt(floor, 10);
  const data = await fetchTribeTowerData(manufacturer, floorNumber);

  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/tribe", label: "Tribe Tower" },
    { label: `Floor ${floor}` },
  ];

  return (
    <main className="flex-1 relative space-y-4">
      <Header
        breadcrumbs={breadcrumbs}
        title="Tribe Tower"
        subtitle={`${
          manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1)
        } - Floor ${floor}`}
      />

      <Card className="container mx-auto w-full p-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Teams</CardTitle>
          <TribeTowerSubmitTeamModal
            towerId={data.tower.id}
            towerName={data.tower.name}
            floor={floorNumber}
            allowCharacterRepeat={false}
            versions={data.versions}
            manufacturer={manufacturer}
          />
        </CardHeader>
        <CardContent className="p-4 pt-0 xl:p-6">
          <TribeTowerTeamList
            initialTeams={data.teams}
            versions={data.versions}
            initialUserLikes={data.userLikes}
          />
        </CardContent>
      </Card>
    </main>
  );
}
