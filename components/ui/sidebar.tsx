"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import useBetterMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Sword,
  Users,
  BookOpen,
  Map,
  Star,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Castle,
  Swords,
  Target,
  LogOut,
  Menu,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SettingsDialog from "@/components/ui/settings";
import { signInWithDiscord, signOut } from "@/app/actions/auth";
import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { mappingLogoThemes } from "@/lib/utils";

type SidebarOption = {
  icon: React.ElementType;
  label: string;
  href: string;
  separator?: boolean;
};

const sidebarOptions: SidebarOption[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Story", href: "/story" },
  { icon: Castle, label: "Tribe Tower", href: "/tribe" },
  { icon: Target, label: "Interception", href: "/interception" },
  // { icon: Swords, label: "Solo Raid", href: "/solo-raid" },
  // { icon: Users, label: "Special Arena", href: "/special-arena" },
  { icon: Settings, label: "Settings", href: "/settings", separator: true },
  { icon: HelpCircle, label: "Support", href: "/help" },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isDesktop = useBetterMediaQuery("(min-width: 1024px)");
  const { theme, setTheme } = useTheme();
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const sidebarVariants = {
    open: {
      width: "15rem",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      width: "4rem",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const contentVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 },
  };

  useEffect(() => {
    if (!isDesktop) {
      setIsCollapsed(true);
    }
  }, [isDesktop]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("is_admin", {
          user_id: user.id,
        });
        if (data) {
          setIsAdmin(data);
        }
      }
    };
    checkAdminStatus();
  }, [user]);

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSettingsOpen(true);
  };

  const isActive = (href: string) => pathname === href;

  async function onSignOut() {
    await signOut();
  }

  async function onSignIn() {
    await signInWithDiscord({ pathname });
  }

  return (
    <motion.aside
      initial={false}
      onMouseEnter={() => isDesktop && setIsCollapsed(false)}
      onMouseLeave={() => isDesktop && setIsCollapsed(true)}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "spring", bounce: 0.05, duration: 0.2 }}
      className={`
        flex flex-col justify-between h-screen bg-background text-foreground
        transition-all duration-300 ease-in-out border-r border-border py-2
        sticky top-0 z-10
        ${isCollapsed ? "" : "fixed top-0 left-0"}
      `}
    >
      {/* Logo section */}
      <div className="p-2 flex justify-center items-center overflow-hidden border-b border-border">
        <div className="flex select-none group cursor-pointer items-center">
          <Image
            alt="Victorix Logo"
            src={
              mappingLogoThemes[theme as keyof typeof mappingLogoThemes] ||
              "/logo-black.png"
            }
            width={36}
            height={36}
            className="group-hover:animate-spin"
          />
          <AnimatePresence>
            {!isCollapsed && isDesktop && (
              <motion.h1
                className="text-3xl ml-2 whitespace-nowrap text-primary"
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
              >
                Victorix
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation options */}
      <nav className="flex-grow overflow-y-auto mt-2 text-muted-foreground space-y-1.5 px-2">
        <TooltipProvider>
          {sidebarOptions.map((option, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 1 }}>
                  {option.separator && <Separator className="my-4" />}
                  {option.label === "Settings" ? (
                    <Dialog
                      open={isSettingsOpen}
                      onOpenChange={setIsSettingsOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className={cn(
                            `w-full flex items-center text-left md:py-2 md:px-3 hover:bg-accent hover:text-accent-foreground
                            ${
                              isCollapsed ? "justify-center" : "justify-start"
                            }`,
                            isActive(option.href) &&
                              "bg-accent text-accent-foreground"
                          )}
                          variant={
                            isActive(option.href) ? "secondary" : "ghost"
                          }
                          size={isDesktop ? "default" : "icon"}
                          onClick={handleSettingsClick}
                        >
                          <OptionContent
                            option={option}
                            isActive={isActive(option.href)}
                            isCollapsed={isCollapsed}
                            isDesktop={isDesktop}
                          />
                        </Button>
                      </DialogTrigger>
                      <SettingsDialog />
                    </Dialog>
                  ) : (
                    <Button
                      className={cn(
                        `w-full flex items-center text-left md:py-2 md:px-3 hover:bg-accent hover:text-accent-foreground
                        ${isCollapsed ? "justify-center" : "justify-start"}`,
                        isActive(option.href) &&
                          "bg-accent text-accent-foreground"
                      )}
                      variant={isActive(option.href) ? "secondary" : "ghost"}
                      size={isDesktop ? "default" : "icon"}
                      asChild
                    >
                      <Link href={option.href}>
                        <OptionContent
                          option={option}
                          isActive={isActive(option.href)}
                          isCollapsed={isCollapsed}
                          isDesktop={isDesktop}
                        />
                      </Link>
                    </Button>
                  )}
                </motion.div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" sideOffset={1}>
                  <span>{option.label}</span>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      <motion.div
        className="fixed top-4 left-4 z-50"
        initial={false}
        animate={isCollapsed ? "closed" : "open"}
        variants={{
          open: { x: "10rem" },
          closed: { x: "2rem" },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="bg-gradient-to-b from-muted to-card border border-border rounded-full size-8 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>

      <div className="mt-auto p-2 border-t border-border">
        {user ? (
          <div
            className={cn(
              "flex items-center space-x-2",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {!isCollapsed && (
              <>
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={`${user.user_metadata.full_name}'s Avatar`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium truncate max-w-[100px]">
                  {user.user_metadata.full_name}
                </span>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSignOut}
              className={cn("ml-auto", isCollapsed && "ml-0")}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSignIn}
                  className={cn(
                    "w-full flex items-center justify-center",
                    isCollapsed ? "p-2" : "space-x-2"
                  )}
                  size={isCollapsed ? "icon" : "default"}
                >
                  <Image
                    src="/discord-mark-white.svg"
                    alt="Discord Logo"
                    width={20}
                    height={20}
                    className={cn("filter invert", !isCollapsed && "mr-2")}
                  />
                  {!isCollapsed && <span>Login with Discord</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" sideOffset={1}>
                  <span>Login with Discord</span>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </motion.aside>
  );
};

const OptionContent: React.FC<{
  option: SidebarOption;
  isActive: boolean;
  isCollapsed: boolean;
  isDesktop: boolean | undefined;
}> = ({ option, isActive, isCollapsed, isDesktop }) => (
  <div
    className={cn(
      "w-full flex flex-row items-center transition-all duration-300 ease-in-out",
      isCollapsed ? "justify-center" : "justify-start overflow-hidden"
    )}
  >
    <motion.div
      initial={false}
      animate={isCollapsed ? { rotate: 0 } : { rotate: 0 }}
      transition={{ duration: 0.3 }}
    >
      <option.icon
        className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")}
      />
    </motion.div>
    <AnimatePresence mode="popLayout">
      {!isCollapsed && (
        <motion.span
          className={cn(
            "ml-3 text-sm whitespace-nowrap",
            isActive && "font-semibold"
          )}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{
            opacity: { duration: 0.2 },
            width: { duration: 0.3 },
          }}
        >
          {option.label}
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

export default Sidebar;
