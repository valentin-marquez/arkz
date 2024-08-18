// components/admin/NikkePreview.tsx
"use client";

import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const NikkePreview = () => {
  const { watch } = useFormContext();
  const nikkeData = watch();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nikke Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {nikkeData.icon_url && (
            <Image
              src={`https://wpmsxwfbianvrxmdvnyg.supabase.co/storage/v1/object/public/media/${nikkeData.icon_url}`}
              alt={nikkeData.name || "Nikke Icon"}
              width={128}
              height={128}
              className="rounded-full"
            />
          )}
          <h2 className="text-2xl font-bold">{nikkeData.name}</h2>
          <div className="flex space-x-2">
            <Badge>{nikkeData.rarity}</Badge>
            <Badge>{nikkeData.element}</Badge>
            <Badge>{nikkeData.weapon_type}</Badge>
          </div>
          <p>Burst: {nikkeData.burst}</p>
          <p>Manufacturer: {nikkeData.manufacturer}</p>
        </div>
        {nikkeData.full_image_url && (
          <Image
            src={`https://wpmsxwfbianvrxmdvnyg.supabase.co/storage/v1/object/public/media/${nikkeData.full_image_url}`}
            alt={`${nikkeData.name} Full Image`}
            width={300}
            height={600}
            className="mt-4 mx-auto"
          />
        )}
      </CardContent>
    </Card>
  );
};
