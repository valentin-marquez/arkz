/* eslint-disable react/no-unescaped-entities */
import { getEvents } from "@/app/actions/events";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TimelineSkeleton } from "@/components/ui/timeline-skeleton";
import TimerSkeleton from "@/components/ui/timer-skeleton";
import TwitterTimelineSkeleton from "@/components/ui/twitter-timeline-skeleton";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { Suspense } from "react";
import Wallpaper from "../../public/Images/landing-wallpaper.png";

const Timeline = dynamic(() => import("@/components/ui/timeline"), {
  loading: () => <TimelineSkeleton />,
});

const Timer = dynamic(() => import("@/components/ui/timer"), {
  loading: () => <TimerSkeleton />,
});

const TwitterTimeline = dynamic(
  () => import("@/components/ui/twitter-timeline"),
  {
    loading: () => <TwitterTimelineSkeleton />,
  }
);

const Home: React.FC = async () => {
  const events = await getEvents();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Card */}
      <Card className="relative bg-muted/60 border-2 flex items-center justify-center p-4 mb-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={Wallpaper}
            alt="Landing Background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="opacity-30"
            priority
          />
        </div>

        {/* Card Content */}
        <div className="relative z-10 w-full space-y-4 sm:space-y-6 text-center">
          <Image
            src="/logo-white.png"
            width={80}
            height={80}
            className="mx-auto w-20 h-20 sm:w-24 sm:h-24"
            alt="ARKZ Logo"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary flex flex-wrap items-center justify-center">
            🎉 Welcome to ARKZ, Commander!
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to assemble the ultimate Nikke squad? You've just entered the
            most advanced Nikke team database in the world! Whether you're
            planning to conquer the Story Mode or dominate in Tribe Tower, ARKZ
            has got your six. Search, share, and discover killer team comps
            that'll make even the toughest enemies shake in their boots.
            Remember, in this game, your team is your weapon – so lock, load,
            and let's build some unstoppable squads! Happy hunting, Commander!
            🚀💥
          </p>
        </div>
      </Card>
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Server Reset */}
          <Card className="bg-transparent border-none p-0">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Server Reset
            </CardTitle>
            <CardContent className="p-0 rounded-lg shadow-inner">
              <Suspense fallback={<TimerSkeleton />}>
                <Timer
                  utcTime="20:00"
                  className="bg-muted/60 w-full"
                  titleClassName="text-center"
                  timeUnitClassName="px-2"
                  separatorClassName="bg-primary/20"
                  progressBarClassName="bg-primary/20"
                />
              </Suspense>
            </CardContent>
          </Card>
          {/* Events */}
          <Card className="bg-transparent border-none p-0">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Events
            </CardTitle>
            <CardContent className="p-0">
              <div className="rounded-lg shadow-inner">
                <Timeline initialEvents={events} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="h-auto">
          {/* Latest Tweets */}
          <Card className="bg-transparent border-none p-0 h-auto">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Latest Tweets
            </CardTitle>
            <CardContent className="p-0">
              <div className="rounded-lg shadow-inner">
                <Suspense fallback={<TwitterTimelineSkeleton />}>
                  <TwitterTimeline />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
