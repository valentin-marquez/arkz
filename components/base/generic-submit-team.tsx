"use client";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import DynamicFilterInput from "@/components/ui/DynamicFilterInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterStore } from "@/lib/store/character-store";
import { useTeamStore } from "@/lib/store/team-store";
import { getMediaURL } from "@/lib/supabase/utils";
import { Tables } from "@/lib/types/database.types";
import { AnimatePresence, m as motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface GenericSubmitTeamProps<T> {
  numberOfTeams: number;
  versions: Tables<"game_versions">[];
  renderCharacterCard: (
    character: Tables<"nikkes">,
    onClick: () => void
  ) => React.ReactNode;
  onSubmit: (
    teams: Tables<"nikkes">[][],
    comment: string,
    version: string
  ) => Promise<void>;
  onClose: () => void;
}

const TEAM_SIZE = 5;

const MotionButton = motion(Button);

export default function GenericSubmitTeam<T>({
  numberOfTeams,
  versions,
  renderCharacterCard,
  onSubmit,
  onClose,
}: GenericSubmitTeamProps<T>) {
  const {
    characters,
    setCharacters,
    filteredCharacters,
    setFilter,
    setRarities,
    setElements,
    setWeaponTypes,
    setBurst,
    setManufacturer,
  } = useCharacterStore();
  const { teams, setTeams, addNikkeToTeam, removeNikkeFromTeam, isNikkeUsed } =
    useTeamStore();
  const [activeTeam, setActiveTeam] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(versions[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    setTeams(Array(numberOfTeams).fill(Array(TEAM_SIZE).fill(null)));
  }, [setTeams, numberOfTeams]);

  const handleFilterChange = (
    newFilters: { type: string; value: string }[],
    newSearchTerm: string
  ) => {
    setFilter(newSearchTerm);

    // Reset all filters
    setRarities([]);
    setElements([]);
    setWeaponTypes([]);
    setBurst(undefined);
    setManufacturer(undefined);

    // Apply new filters
    newFilters.forEach((filter) => {
      switch (filter.type.toLowerCase()) {
        case "rarity":
          setRarities([filter.value.toUpperCase()]);
          break;
        case "element":
          setElements([
            filter.value.charAt(0).toUpperCase() + filter.value.slice(1),
          ]);
          break;
        case "weapon_type":
          setWeaponTypes([filter.value.toUpperCase()]);
          break;
        case "burst":
          setBurst(filter.value === "multiple" ? "Multiple" : filter.value);
          break;
        case "manufacturer":
          setManufacturer(
            filter.value.charAt(0).toUpperCase() + filter.value.slice(1)
          );
          break;
      }
    });
  };

  const handleAddToTeam = (character: Tables<"nikkes">) => {
    const emptySlotIndex = teams[activeTeam].findIndex((slot) => slot === null);
    if (emptySlotIndex !== -1 && !isNikkeUsed(character.id)) {
      addNikkeToTeam(character, activeTeam, emptySlotIndex);
    }
  };

  const handleRemoveFromTeam = (teamIndex: number, characterIndex: number) => {
    removeNikkeFromTeam(teamIndex, characterIndex);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(teams as Tables<"nikkes">[][], comment, selectedVersion);
      onClose();
    } catch (error) {
      console.error("Error submitting team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
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
              <div className="relative">
                <Textarea
                  placeholder="Add a comment about your team(s)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-24 mb-2"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={togglePreview}
                >
                  {isPreviewVisible ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </>
                  )}
                </Button>
              </div>
              <AnimatePresence>
                {isPreviewVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-4 border rounded-md bg-muted overflow-hidden"
                  >
                    <MarkdownRenderer content={comment} />
                  </motion.div>
                )}
              </AnimatePresence>
              <MotionButton
                onClick={handleSubmit}
                className="w-full mt-4"
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
              <DynamicFilterInput onFilterChange={handleFilterChange} />
            </div>
            <ScrollArea className="flex-grow h-80 lg:h-[480px] px-1.5">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-2 p-2"
              >
                {filteredCharacters.map((character) => (
                  <motion.div
                    key={character.id}
                    className={
                      isNikkeUsed(character.id)
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
