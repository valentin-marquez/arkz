"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMediaURL } from "@/lib/supabase/utils";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const isDark =
    theme?.toString().includes("dark") || theme?.toString() === "default"
      ? true
      : false;

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
            style={{ objectFit: "cover" }}
            className="rounded-md"
            draggable={false}
            placeholder="blur"
            blurDataURL="/placeholder-image.png"
            sizes="(max-width: 640px) 100vw, 200px"
            fill
          />
        </motion.div>
        <div className="flex-grow">
          <h3 className="text-base font-semibold line-clamp-1">{name}</h3>
          <div className="flex items-center space-x-1 mt-1">
            <Badge variant="outline" className={`text-xs ${rarity}-badge`}>
              {rarity.toUpperCase()}
            </Badge>
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
            <Image
              src={getMediaURL(
                `/images/weapons/weapon_${weapon_type.toLowerCase()}.webp`
              )}
              alt={weapon_type}
              width={20}
              height={20}
              placeholder="empty"
              blurDataURL="/placeholder-image.png"
              className={isDark ? "" : "filter invert"}
            />
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
          transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
        >
          {cardContent}
        </motion.div>
      </Link>
    );
  } else {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }
};

export default CharacterCard;
