"use client";
import { Card } from "@/components/ui/card";
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
} from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
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
import React, { useEffect, useRef, useState } from "react";
import TimelineEvent from "./timeline-event";

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<Tables<"game_events">[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null); // Ref para el viewport
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!loading && events.length > 0) {
      const dates = calculateDates(events);
      setStartDate(dates.startDate);
      setTotalDays(dates.totalDays);
      scrollToToday();
    }
  }, [loading, events]);

  const fetchEvents = async () => {
    const supabase = createClient();
    const currentDate = new Date();
    const threeDaysAgo = subDays(currentDate, 3);

    const { data: eventsData, error: eventsError } = await supabase
      .from("game_events")
      .select("*")
      .or(
        `end_date.gte.${threeDaysAgo.toISOString()},and(start_date.lte.${currentDate.toISOString()},end_date.gte.${currentDate.toISOString()})`
      )
      .order("importance", { ascending: true })
      .order("start_date", { ascending: true });

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
    } else {
      setEvents(eventsData as Tables<"game_events">[]);
    }
    setLoading(false);
  };

  const calculateDates = (events: Tables<"game_events">[]) => {
    const sortedEvents = events.sort((a, b) =>
      a.start_date.localeCompare(b.start_date)
    );
    const earliestStartDate = parseISO(sortedEvents[0].start_date);
    const startDate = subDays(earliestStartDate, 3);
    const endDate = parseISO(sortedEvents[sortedEvents.length - 1].end_date);
    const totalDays = differenceInDays(endDate, startDate) + 1;
    return { startDate, totalDays };
  };

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
      <Card className="container mx-auto p-4 bg-background text-foreground">
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
