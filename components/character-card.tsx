"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMediaURL } from "@/lib/supabase/utils";
import Link from "next/link";
import { motion } from "framer-motion";

type CharacterProps = {
  id: string;
  name: string;
  slug: string;
  icon_url: string;
  rarity: string;
  element: string;
  weapon_type: string;
  isLink?: boolean;
  onClick?: () => void;
};

const CharacterCard: React.FC<CharacterProps> = ({
  id,
  name,
  slug,
  icon_url,
  rarity,
  element,
  weapon_type,
  isLink = false,
  onClick,
}) => {
  const cardContent = (
    <Card className={`w-full overflow-hidden border-2`}>
      <CardContent className="p-3 flex items-center space-x-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-16 h-16 flex-shrink-0"
        >
          <Image
            src={getMediaURL(icon_url, "media")}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            draggable={false}
            placeholder="blur"
            blurDataURL="/placeholder-image.png"
          />
        </motion.div>
        <div className="flex-grow">
          <h3 className="text-base font-semibold line-clamp-1">{name}</h3>
          <div className="flex items-center space-x-1 mt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className={`text-xs ${rarity}-badge`}
                  >
                    {rarity.toUpperCase()}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rarity: {rarity.toUpperCase()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src={getMediaURL(
                      `/images/elements/element_${element.toLowerCase()}.webp`
                    )}
                    alt={element}
                    width={20}
                    height={20}
                    placeholder="empty"
                    blurDataURL="/placeholder-image.png"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Element: {element}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src={getMediaURL(
                      `/images/weapons/weapon_${weapon_type.toLowerCase()}.webp`
                    )}
                    alt={weapon_type}
                    width={20}
                    height={20}
                    placeholder="empty"
                    blurDataURL="/placeholder-image.png"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Weapon: {weapon_type}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLink) {
    return (
      <Link href={`/character/${slug}`} className="block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {cardContent}
        </motion.div>
      </Link>
    );
  } else {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }
};

export default CharacterCard;
