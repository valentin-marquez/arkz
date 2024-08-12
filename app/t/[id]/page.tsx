import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, Users, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/lib/supabase/server";
import NikkeItemList from "@/components/NikkeItemList";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Separator } from "@/components/ui/separator";

type Nikke = {
  nikke_id: string;
  name: string;
  icon_url: string;
  rarity: string;
  position: number;
};

type TeamDetails = {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  mode: string;
  comment?: string | null;
  total_votes: number;
  nikkes: Nikke[];
  chapter_number?: number;
  difficulty?: string;
  tower_name?: string;
  floor?: number;
  boss_name?: string;
  boss_element?: string;
};

async function getTeamDetails(shortCode: string): Promise<TeamDetails | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_team_details_by_short_code",
    {
      p_short_code: shortCode,
    },
    { get: true }
  );

  if (error || !data) {
    return null;
  }

  return data as TeamDetails;
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const team = await getTeamDetails(params.id);

  if (!team) {
    notFound();
  }

  const getModeName = (mode: string) => {
    switch (mode) {
      case "story":
        return "Story";
      case "tribe_tower":
        return "Tribe Tower";
      case "interception":
        return "Interception";
      default:
        return mode.charAt(0).toUpperCase() + mode.slice(1);
    }
  };
  return (
    <main className="flex-1 bg-gradient-to-b from-background to-secondary/20 min-h-screen">
      <div className=" mx-auto px-4 py-8 space-y-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize font-bold">
                {team.username}&apos;s Team
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Separator />

        <Card className="bg-card text-card-foreground shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-4 border-primary-foreground">
                  <AvatarImage src={team.avatar_url} alt={team.username} />
                  <AvatarFallback>{team.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {team.username}&apos;s Team
                  </CardTitle>
                  <p className="text-sm opacity-80 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(team.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {getModeName(team.mode)}
                </Badge>
                <Button variant="secondary" className="flex items-center">
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  <span>{team.total_votes} votes</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2" /> Team Composition
              </h3>
              <NikkeItemList nikkes={team.nikkes} />
            </section>

            {team.comment && (
              <section className="bg-muted rounded-lg shadow-inner p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MessageSquare className="mr-2" /> Team Strategy
                </h3>
                <MarkdownRenderer content={team.comment} />
              </section>
            )}

            {/* Additional team details */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.chapter_number && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Chapter</h4>
                    <p>{team.chapter_number}</p>
                  </CardContent>
                </Card>
              )}
              {team.difficulty && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Difficulty</h4>
                    <p>{team.difficulty}</p>
                  </CardContent>
                </Card>
              )}
              {team.tower_name && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Tower</h4>
                    <p>{team.tower_name}</p>
                  </CardContent>
                </Card>
              )}
              {team.floor && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Floor</h4>
                    <p>{team.floor}</p>
                  </CardContent>
                </Card>
              )}
              {team.boss_name && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Boss</h4>
                    <p>{team.boss_name}</p>
                  </CardContent>
                </Card>
              )}
              {team.boss_element && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Boss Element</h4>
                    <p>{team.boss_element}</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
