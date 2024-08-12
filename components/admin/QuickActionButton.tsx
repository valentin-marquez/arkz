"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface QuickActionButtonProps {
  label: string;
  action: string;
}

export default function QuickActionButton({
  label,
  action,
}: QuickActionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(action);
  };

  return (
    <Button onClick={handleClick} variant="default" className="w-full">
      {label}
    </Button>
  );
}
