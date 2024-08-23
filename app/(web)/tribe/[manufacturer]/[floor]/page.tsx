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

export async function generateMetadata({
  params,
}: {
  params: { manufacturer: string; floor: string };
}): Promise<Metadata> {
  const { manufacturer, floor } = params;

  if (manufacturer === "all"){
    return {
      title: `Arkz - Tribe Tower Guide | Floor ${floor} Strategy & Team Comps`,
      description: `Master Floor ${floor} of the All Tribe Tower in Nikke: Goddess of Victory with top-tier team compositions and strategies. Explore optimized setups to ensure your victory in every battle.`,
    };
  }

  return {
    title: `Arkz - ${manufacturer} Tribe Tower Guide | Floor ${floor} Strategy & Team Comps`,
    description: `Master Floor ${floor} of the ${manufacturer} Tribe Tower in Nikke: Goddess of Victory with top-tier team compositions and strategies. Explore optimized setups to ensure your victory in every battle.`,
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

  return (
    <main className="flex-1 relative space-y-4">
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-col w-full">
          <Breadcrumb className="px-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/tribe">Tribe Tower</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">
                  Floor {floor}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="px-8 flex flex-wrap flex-col">
            <h1 className="text-2xl w-fit">Tribe Tower</h1>
            <p className="text-muted-foreground mt-0 capitalize text-sm">
              {manufacturer} - Floor {floor}
            </p>
          </div>
        </div>
      </div>

      <Separator />

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
          />
        </CardContent>
      </Card>
    </main>
  );
}
