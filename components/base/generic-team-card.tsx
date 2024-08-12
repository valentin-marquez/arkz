"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { team_nikke_details } from "@/lib/types/database.types";
import { getMediaURL } from "@/lib/supabase/utils";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { getURL } from "@/lib/utils";
import TeamShortUrlGenerator from "@/components/team-short-url-generator";

export interface TeamCardProps {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  members: team_nikke_details[];
  totalVotes: number;
  comment?: string;
  metadata: Record<string, string | number>;
  onVote: (teamId: string, voteType: "up" | "down") => void;
  renderMetadata: (
    metadata: Record<string, string | number>
  ) => React.ReactNode;
  mode: string;
}

export default function GenericTeamcard({
  id,
  user,
  members,
  totalVotes,
  comment,
  metadata,
  onVote,
  renderMetadata,
  mode,
}: TeamCardProps) {
  return (
    <Card className="w-full max-w-sm bg-card text-card-foreground">
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{user.username}</span>
        </div>
        <TeamShortUrlGenerator teamId={id} mode={mode} />
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {members
            .sort((a, b) => a.position - b.position)
            .map((member) => (
              <div key={member.nikke_id} className="flex flex-col items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={getMediaURL(member.icon_url)}
                    alt={member.name}
                  />
                  <AvatarFallback>{member.name}</AvatarFallback>
                </Avatar>
                <span className="text-xs mt-1 w-8 line-clamp-1">
                  {member.name}
                </span>
              </div>
            ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          {renderMetadata(metadata)}
          <span className="text-sm font-semibold">{totalVotes} votes</span>
        </div>
      </CardContent>

      <Separator />
      <CardFooter className="p-2 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVote(id, "up")}
          className="flex-1"
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Vote
        </Button>
        <Separator orientation="vertical" className="h-8" />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Team Comment</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">{comment}</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
