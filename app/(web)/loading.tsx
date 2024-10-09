import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl transition-all duration-300">
        <CardContent className="flex flex-col items-center p-6 md:p-12 space-y-4 md:space-y-8">
          <Image
            src="/loading.webp"
            alt="Loading"
            width={100}
            height={100}
            className="rounded-lg w-24 h-24 md:w-64 md:h-64 lg:w-80 lg:h-80 transition-all duration-300"
            unoptimized
            priority
          />
          <h4 className="text-lg md:text-2xl lg:text-3xl font-semibold text-foreground transition-all duration-300">
            Loading...
          </h4>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground flex flex-row items-center gap-1 transition-all duration-300">
            artwork by
            <Link
              className="text-primary underline underline-offset-2 decoration-primary hover:text-primary/80 transition-colors"
              href="https://x.com/musan_pro"
              target="_blank"
              rel="noopener noreferrer"
            >
              @musan_pro
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
