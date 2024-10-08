import * as Progress from "@radix-ui/react-progress";
import * as Separator from "@radix-ui/react-separator";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AnimatePresence, m as motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimerProps {
  utcTime: string; // Format: "HH:mm"
  className?: string;
  titleClassName?: string;
  timeUnitClassName?: string;
  separatorClassName?: string;
  progressBarClassName?: string;
}

interface TimeUnitProps {
  value: number;
  unit: string;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  utcTime,
  className = "",
  titleClassName = "",
  timeUnitClassName = "",
  separatorClassName = "",
  progressBarClassName = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date();
      const [hours, minutes] = utcTime.split(":").map(Number);
      let targetTime = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          hours,
          minutes
        )
      );

      if (now > targetTime) {
        targetTime.setUTCDate(targetTime.getUTCDate() + 1);
      }

      const difference = +targetTime - +now;

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      const totalSeconds =
        newTimeLeft.hours * 3600 +
        newTimeLeft.minutes * 60 +
        newTimeLeft.seconds;
      const totalDuration = 24 * 60 * 60; // 24 hours in seconds
      const newProgress = (totalSeconds / totalDuration) * 100;
      setProgress(newProgress);
    }, 1000);

    return () => clearInterval(timer);
  }, [utcTime]);

  return (
    <Tooltip.Provider>
      <div
        className={`w-full  mx-auto p-4 bg-muted/60 rounded-lg shadow-lg border-2 ${className}`}
      >
        <h2
          className={`text-xl sm:text-2xl font-bold text-primary mb-4 ${titleClassName}`}
        >
          Daily Countdown
        </h2>
        <div className="flex justify-evenly mb-4">
          <TimeUnit
            value={timeLeft.hours}
            unit="Hours"
            className={timeUnitClassName}
          />
          <Separator.Root
            className={`bg-border w-[1px] mx-2 ${separatorClassName}`}
          />
          <TimeUnit
            value={timeLeft.minutes}
            unit="Minutes"
            className={timeUnitClassName}
          />
          <Separator.Root
            className={`bg-border w-[1px] mx-2 ${separatorClassName}`}
          />
          <TimeUnit
            value={timeLeft.seconds}
            unit="Seconds"
            className={timeUnitClassName}
          />
        </div>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Progress.Root
              className={`relative overflow-hidden bg-secondary rounded-full w-full h-3 sm:h-4 ${progressBarClassName}`}
              value={progress}
            >
              <Progress.Indicator
                className="bg-primary w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                style={{ transform: `translateX(-${100 - progress}%)` }}
              />
            </Progress.Root>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-popover text-popover-foreground px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm"
              sideOffset={5}
            >
              {`${progress.toFixed(2)}% remaining until ${utcTime} UTC`}
              <Tooltip.Arrow className="fill-popover" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
};

const TimeUnit: React.FC<TimeUnitProps> = ({ value, unit, className = "" }) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <motion.div
        className={`flex flex-col items-center cursor-help ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            className="text-2xl sm:text-3xl font-bold text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {value.toString().padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>
      </motion.div>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        className="bg-popover text-popover-foreground px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm"
        sideOffset={5}
      >
        {`${value} ${unit}`}
        <Tooltip.Arrow className="fill-popover" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
);

export default Timer;
