import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
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
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import TeamShortUrlGenerator from "@/components/team-short-url-generator";
import { Tables } from "@/lib/types/database.types";
import { useAuth } from "@/providers/auth-provider";
import { getMediaURL } from "@/lib/supabase/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export interface TeamCardProps {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  members: Tables<"team_nikke_details">[];
  totalVotes: number;
  comment?: string;
  metadata: Record<string, string | number>;
  renderMetadata: (
    metadata: Record<string, string | number>
  ) => React.ReactNode;
  mode: string;
  isLiked: boolean;
  renderExtraContent?: () => React.ReactNode;
}

export default function GenericTeamCard({
  id,
  user,
  members,
  totalVotes: initialTotalVotes,
  comment,
  metadata,
  renderMetadata,
  mode,
  isLiked: initialIsLiked,
  renderExtraContent,
}: TeamCardProps) {
  const { user: currentUser } = useAuth();
  const supabase = createClient();
  const [localIsLiked, setLocalIsLiked] = useState(initialIsLiked);
  const [localTotalVotes, setLocalTotalVotes] = useState(initialTotalVotes);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel(`team_likes:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_likes",
          filter: `team_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new.user_id !== currentUser?.id) {
              setLocalTotalVotes((prev) => Math.max(0, prev + 1));
            }
          } else if (payload.eventType === "DELETE") {
            if (payload.old.user_id !== currentUser?.id) {
              setLocalTotalVotes((prev) => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, supabase, currentUser]);

  useEffect(() => {
    setLocalIsLiked(initialIsLiked);
    setLocalTotalVotes(initialTotalVotes);
  }, [initialIsLiked, initialTotalVotes]);

  const handleLike = async () => {
    if (!currentUser || isUpdating) return;

    setIsUpdating(true);
    const newIsLiked = !localIsLiked;
    setLocalIsLiked(newIsLiked);
    setLocalTotalVotes((prev) => Math.max(0, newIsLiked ? prev + 1 : prev - 1));

    try {
      if (newIsLiked) {
        await supabase
          .from("user_likes")
          .insert({ user_id: currentUser.id, team_id: id });
      } else {
        await supabase
          .from("user_likes")
          .delete()
          .match({ user_id: currentUser.id, team_id: id });
      }
    } catch (error) {
      setLocalIsLiked(!newIsLiked);
      setLocalTotalVotes((prev) =>
        Math.max(0, newIsLiked ? prev - 1 : prev + 1)
      );
      console.error("Failed to update like:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderNikkes = () => {
    const sortedMembers = members.sort((a, b) => a.position - b.position);
    const displayedMembers = showAllMembers
      ? sortedMembers
      : sortedMembers.slice(0, 5);

    return (
      <motion.div
        className="grid grid-cols-5 gap-2 mb-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {displayedMembers.map((member) => (
          <motion.div
            key={member.nikke_id}
            className="flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <Avatar className="w-12 h-12 border-2 border-primary">
              <AvatarImage
                src={getMediaURL(member.icon_url)}
                alt={member.name}
              />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1 w-full text-center truncate">
              {member.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-sm bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300">
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
          {renderNikkes()}
          {members.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllMembers(!showAllMembers)}
              className="w-full mt-2"
            >
              {showAllMembers ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Show All Nikkes
                </>
              )}
            </Button>
          )}
          <div className="flex items-center justify-between mt-4">
            {renderMetadata(metadata)}
            <AnimatePresence>
              <motion.span
                key={localTotalVotes}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-sm font-semibold"
              >
                {localTotalVotes} votes
              </motion.span>
            </AnimatePresence>
          </div>
        </CardContent>

        {renderExtraContent && (
          <>
            <Separator />
            <CardContent>{renderExtraContent()}</CardContent>
          </>
        )}

        <Separator />
        <CardFooter className="p-2 flex justify-around">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={localIsLiked ? "default" : "ghost"}
              size="sm"
              onClick={handleLike}
              className={`flex-1 transition-colors duration-300 ${
                localIsLiked ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <ThumbsUp
                className={`w-4 h-4 mr-2 transition-all duration-300 ${
                  localIsLiked ? "fill-current scale-110" : ""
                }`}
              />
              {localTotalVotes} Likes
            </Button>
          </motion.div>
          <Separator orientation="vertical" className="h-8" />
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comment
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Team Comment</DialogTitle>
              </DialogHeader>
              <div className="mt-2 max-h-[60vh] overflow-y-auto">
                <MarkdownRenderer content={comment || ""} />
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
