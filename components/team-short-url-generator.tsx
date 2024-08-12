import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getURL } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TeamShortUrlGenerator = ({
  teamId,
  mode,
}: {
  teamId: string;
  mode: string;
}) => {
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateShortUrl = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("create_short_url_for_team", {
      p_team_id: teamId,
      p_mode: mode,
    });

    console.log(teamId, mode);

    console.log(data, error);

    setIsLoading(false);

    if (error) {
      console.error("Error generating short URL:", error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const fullShortUrl = getURL(`/t/${data}`);
    setShortUrl(fullShortUrl);
    toast({
      title: "Link generated!",
      description: "Your team link has been created successfully.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "The team link has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetShortUrl = () => {
    setShortUrl("");
  };

  return (
    <TooltipProvider>
      <div className="relative">
        <AnimatePresence mode="wait">
          {!shortUrl ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={generateShortUrl}
                    disabled={isLoading}
                    size="icon"
                    variant="ghost"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate share link</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
              className="flex space-x-1"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={copyToClipboard} size="icon" variant="ghost">
                    <AnimatePresence mode="wait">
                      {isCopied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy share link</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={resetShortUrl} size="icon" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset share link</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default TeamShortUrlGenerator;
