"use client";
import { Card } from "@/components/ui/card";
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
} from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/lib/types/database.types";
import {
  addDays,
  differenceInDays,
  format,
  isToday,
  parseISO,
  subDays,
} from "date-fns";
import { AnimatePresence, m as motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TimelineEvent from "./timeline-event";

interface TimelineProps {
  initialEvents: Tables<"game_events">[];
}

const Timeline: React.FC<TimelineProps> = ({ initialEvents }) => {
  const [events] = useState<Tables<"game_events">[]>(initialEvents);
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const calculateDates = (events: Tables<"game_events">[]) => {
    if (events.length === 0) {
      return { startDate: new Date(), totalDays: 0 };
    }
    const sortedEvents = events.sort((a, b) =>
      a.start_date.localeCompare(b.start_date)
    );
    const earliestStartDate = parseISO(sortedEvents[0].start_date);
    const startDate = subDays(earliestStartDate, 3);
    const endDate = parseISO(sortedEvents[sortedEvents.length - 1].end_date);
    const totalDays = differenceInDays(endDate, startDate) + 1;
    return { startDate, totalDays };
  };

  const { startDate, totalDays } = useMemo(
    () => calculateDates(events),
    [events]
  );

  useEffect(() => {
    if (events.length > 0) {
      scrollToToday();
    }
  }, [events, startDate]);

  const scrollToToday = () => {
    if (viewportRef.current) {
      const dayWidth = 56; // Ancho de cada día en píxeles
      const today = new Date();
      const daysSinceStart = differenceInDays(today, startDate);
      const scrollPosition = Math.max(
        0,
        daysSinceStart * dayWidth -
          viewportRef.current.clientWidth / 2 +
          dayWidth / 2
      );

      viewportRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  if (events.length === 0) {
    return (
      <Card className="container mx-auto p-4 bg-muted/60 text-foreground">
        No events found
      </Card>
    );
  }

  return (
    <Card className="container mx-auto p-4 bg-muted/60 text-foreground">
      <ScrollArea ref={scrollAreaRef} className="w-full whitespace-nowrap">
        <ScrollAreaViewport className="w-full h-auto" ref={viewportRef}>
          <DateHeader
            startDate={startDate}
            totalDays={totalDays}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
          />
          <Separator className="mb-4" />
          <EventList
            events={events}
            startDate={startDate}
            totalDays={totalDays}
            expanded={expanded}
          />
        </ScrollAreaViewport>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};

const DateHeader: React.FC<{
  startDate: Date;
  totalDays: number;
  selectedDate: Date;
  onDateClick: (date: Date) => void;
}> = ({ startDate, totalDays, selectedDate, onDateClick }) => (
  <div className="mb-4 flex relative" style={{ width: `${totalDays * 56}px` }}>
    {Array.from({ length: totalDays }).map((_, index) => {
      const currentDate = addDays(startDate, index);
      const isCurrentDay = isToday(currentDate);
      const isSelected =
        format(currentDate, "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd");
      return (
        <div
          key={index}
          className={`flex-none w-14 text-center cursor-pointer ${
            isSelected
              ? "bg-primary text-primary-foreground rounded-md"
              : isCurrentDay
              ? "bg-secondary text-secondary-foreground rounded-md"
              : ""
          }`}
          onClick={() => onDateClick(currentDate)}
        >
          <div
            className={`text-xs ${
              isSelected || isCurrentDay
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            {format(currentDate, "EEE")}
          </div>
          <div className="text-sm font-semibold">
            {format(currentDate, "d")}
          </div>
        </div>
      );
    })}
  </div>
);

const EventList: React.FC<{
  events: Tables<"game_events">[];
  startDate: Date;
  totalDays: number;
  expanded: boolean;
}> = ({ events, startDate, totalDays, expanded }) => (
  <AnimatePresence>
    <motion.div
      className="space-y-2 relative overflow-y-auto"
      style={{
        width: `${totalDays * 56}px`,
        maxHeight: expanded ? "none" : "300px",
      }}
      initial="collapsed"
      animate={expanded ? "expanded" : "collapsed"}
      variants={{
        expanded: { height: "auto" },
        collapsed: { height: 300 },
      }}
      transition={{ duration: 0.3 }}
    >
      {events.map((event) => (
        <TimelineEvent
          key={event.id}
          event={event}
          startDate={startDate}
          totalDays={totalDays}
        />
      ))}
    </motion.div>
  </AnimatePresence>
);

export default Timeline;
