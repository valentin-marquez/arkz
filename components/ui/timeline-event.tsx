"use client";

import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMediaURL } from "@/lib/supabase/utils";
import { Tables } from "@/lib/types/database.types";
import { differenceInDays, format, parseISO } from "date-fns";
import { m as motion } from "framer-motion";
import Image from "next/image";
import React from "react";

interface TimelineEventProps {
  event: Tables<"game_events">;
  startDate: Date;
  totalDays: number;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  startDate,
  totalDays,
}) => {
  const eventStartDate = parseISO(event.start_date);
  const eventEndDate = parseISO(event.end_date);
  const startDay = Math.max(0, differenceInDays(eventStartDate, startDate));
  const duration = Math.min(
    differenceInDays(eventEndDate, eventStartDate) + 1,
    totalDays - startDay
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-16 mb-2 cursor-pointer"
          style={{
            left: `${(startDay / totalDays) * 100}%`,
            width: `${(duration / totalDays) * 100}%`,
          }}
        >
          <Card
            className="absolute inset-0 overflow-hidden flex"
            style={{ backgroundColor: event.color }}
          >
            <div className="absolute inset-0 w-[300px] overflow-hidden">
              <Image
                src={getMediaURL(event.image_path)}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="opacity-70"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent to-[color]"
                style={{ "--tw-gradient-to": event.color } as any}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-neutral-foreground font-semibold truncate text-center px-2">
                {event.title}
              </span>
            </div>
          </Card>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="font-semibold mb-2">{event.title}</h3>
        <p className="text-xs text-muted-foreground">
          {format(eventStartDate, "PPP")} - {format(eventEndDate, "PPP")}
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default TimelineEvent;
