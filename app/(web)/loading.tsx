import Image from "next/image";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen space-y-4 bg-background">
      <div className="flex flex-col items-center bg-card p-6 rounded-xl ">
        <Image
          src="/loading.webp"
          alt="Loading"
          width={150}
          height={150}
          className="rounded-2xl mb-4"
          unoptimized
        />
        <h4 className="text-xl font-semibold text-foreground">Loading...</h4>
        <p className="text-sm text-muted-foreground mt-2 flex flex-row gap-1">
          artwork by
          <Link
            className="text-primary underline underline-offset-2 decoration-primary"
            href="https://x.com/musan_pro"
            target="_blank"
            rel="noopener noreferrer"
          >
            @musan_pro
          </Link>
        </p>
      </div>
    </div>
  );
}
