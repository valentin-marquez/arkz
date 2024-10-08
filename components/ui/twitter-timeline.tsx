"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const TwitterTimeline = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card className="bg-muted/60 w-full p-0">
      <CardContent className="p-0 overflow-hidden">
        <a
          className="twitter-timeline"
          data-height="600"
          data-theme="dark"
          data-chrome="noheader nofooter noborders transparent"
          href="https://twitter.com/NIKKE_en"
        >
          Tweets by @NIKKE_en
        </a>
      </CardContent>
    </Card>
  );
};

export default TwitterTimeline;
