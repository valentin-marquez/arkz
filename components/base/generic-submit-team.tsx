"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCharacterStore } from "@/lib/store/character-store";
import { useTeamStore } from "@/lib/store/team-store";
import { createClient } from "@/lib/supabase/client";
import { getMediaURL } from "@/lib/supabase/utils";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface GenericSubmitTeamProps<T> {
  numberOfTeams: number;
  versions: { id: string; version: string }[];
  allowCharacterRepeat: boolean;
  characters: T[];
  renderCharacterCard: (character: T, onClick: () => void) => React.ReactNode;
  getCharacterId: (character: T) => string;
  onSubmit: (teams: T[][], comment: string, version: string) => Promise<void>;
  onClose: () => void;
}

const MotionButton = motion(Button);

export default function GenericSubmitTeam<T>({
  numberOfTeams,
  versions,
  allowCharacterRepeat,
  renderCharacterCard,
  onSubmit,
  onClose,
}: GenericSubmitTeamProps<T>) {
  const supabase = createClient();
  const { characters, setCharacters, filteredCharacters, setFilter } =
    useCharacterStore();
  const { teams, setTeams, addNikkeToTeam, removeNikkeFromTeam } =
    useTeamStore();
  const [activeTeam, setActiveTeam] = useState(0);
  const [comment, setComment] = useState("");
  const [usedCharacters, setUsedCharacters] = useState(new Set());
  const [selectedVersion, setSelectedVersion] = useState(versions[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCharacters = async () => {
      const { data, error } = await supabase.from("nikkes").select("*");
      if (error) {
        console.error("Error fetching characters:", error);
      } else {
        setCharacters(data);
      }
    };

    fetchCharacters();
  }, [setCharacters, supabase]);

  useEffect(() => {
    setTeams(
      Array(numberOfTeams)
        .fill(null)
        .map(() => Array(5).fill(null))
    );
  }, [numberOfTeams, setTeams]);

  useEffect(() => {
    const used = new Set();
    teams.forEach((team) => {
      team.forEach((nikke) => {
        if (nikke) used.add(nikke.id);
      });
    });
    setUsedCharacters(used);
  }, [teams]);

  useEffect(() => {
    setFilter(searchTerm);
  }, [searchTerm, setFilter]);

  const handleAddToTeam = (character: T) => {
    const emptySlotIndex = teams[activeTeam].findIndex((slot) => slot === null);
    if (emptySlotIndex !== -1) {
      addNikkeToTeam(character, activeTeam, emptySlotIndex);
    }
  };

  const handleRemoveFromTeam = (teamIndex: number, characterIndex: number) => {
    removeNikkeFromTeam(teamIndex, characterIndex);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(teams, comment, selectedVersion);
      onClose();
    } catch (error) {
      console.error("Error submitting team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs
        defaultValue="team-0"
        className="flex-grow flex flex-col"
        onValueChange={(value) => setActiveTeam(Number(value.split("-")[1]))}
      >
        <TabsList className="flex justify-start overflow-x-auto p-1 mb-4">
          {teams.map((_, index) => (
            <TabsTrigger
              key={`team-${index}`}
              value={`team-${index}`}
              className="flex-shrink-0"
            >
              Team {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-grow flex flex-col lg:flex-row">
          <div className="lg:w-1/3 mb-4 lg:mb-0 lg:mr-4 flex flex-col">
            <div className="flex-0">
              {teams.map((team, teamIndex) => (
                <TabsContent
                  key={`team-content-${teamIndex}`}
                  value={`team-${teamIndex}`}
                  className="h-full"
                >
                  <div className="flex flex-wrap justify-center items-center gap-2 p-2 border rounded">
                    {team.map((character, characterIndex) => (
                      <motion.div
                        key={`team-${teamIndex}-character-${characterIndex}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          bounce: 0.05,
                          duration: 0.25,
                        }}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden cursor-pointer"
                        onClick={() =>
                          handleRemoveFromTeam(teamIndex, characterIndex)
                        }
                      >
                        {character ? (
                          <Image
                            src={getMediaURL(character.icon_url)}
                            alt={character.name}
                            className="w-full h-full object-cover"
                            width={64}
                            height={64}
                            placeholder="blur"
                            blurDataURL="/placeholder-image.png"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Plus className="text-muted-foreground" size={24} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
            <div className="mt-4">
              <Textarea
                placeholder="Add a comment about your team(s) (Markdown supported)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-24 mb-4"
              />
              <MotionButton
                onClick={handleSubmit}
                className="w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Teams"
                )}
              </MotionButton>
            </div>
          </div>
          <div className="lg:w-2/3 flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search characters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <ScrollArea className="flex-grow h-80 lg:h-[480px] px-1.5">
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-4  gap-2 p-2"
              >
                {filteredCharacters.map((character) => (
                  <motion.div
                    key={character.id}
                    className={
                      usedCharacters.has(character.id) && !allowCharacterRepeat
                        ? "opacity-50 pointer-events-none"
                        : "cursor-pointer"
                    }
                    onClick={() => handleAddToTeam(character)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "spring",
                      bounce: 0.05,
                      duration: 0.25,
                    }}
                  >
                    {renderCharacterCard(character, () =>
                      handleAddToTeam(character)
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
