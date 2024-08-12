"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { getMediaURL } from "@/lib/supabase/utils";

type Nikke = {
  nikke_id: string;
  name: string;
  icon_url: string;
  rarity: string;
  position: number;
};

type NikkeItemProps = {
  nikke: Nikke;
  index: number;
};

const NikkeItem: React.FC<NikkeItemProps> = ({ nikke, index }) => (
  <motion.div
    className="flex-shrink-0 w-32 sm:w-40"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      type: "spring",
      bounce: 0.25,
      duration: 0.5,
      delay: index * 0.1,
    }}
  >
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col items-center">
        <Image
          src={getMediaURL(nikke.icon_url)}
          alt={nikke.name}
          width={80}
          height={80}
          className="rounded-full border-4 border-primary mb-2"
        />
        <span className="text-sm font-medium text-center line-clamp-1">
          {nikke.name}
        </span>
        <Badge variant="secondary" className="mt-1">
          {nikke.rarity}
        </Badge>
      </CardContent>
    </Card>
  </motion.div>
);

const NikkeItemList: React.FC<{ nikkes: Nikke[] }> = ({ nikkes }) => (
  <ScrollArea className="w-full">
    <div className="flex space-x-4 p-4">
      {nikkes.map((nikke, index) => (
        <NikkeItem key={nikke.nikke_id} nikke={nikke} index={index} />
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);

export default NikkeItemList;
