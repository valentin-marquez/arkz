// components/admin/ImageEditor.tsx
"use client";

import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ImageEditorProps {
  sourceImage: string;
  onImageEdited: (path: string) => void;
  folder: string;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  sourceImage,
  onImageEdited,
  folder,
}) => {
  const supabase = createClient();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      const image = new Image();
      image.src = sourceImage;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob(resolve, "image/webp")
      );
      const file = new File([blob], "icon.webp", { type: "image/webp" });

      const fileName = `${Math.random()}.webp`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading file:", error);
      } else {
        onImageEdited(filePath);
      }
    }
  };

  return (
    <div className="relative h-64 mb-4">
      <Cropper
        image={sourceImage}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <Button onClick={handleCrop} className="mt-2">
        Crop Icon
      </Button>
    </div>
  );
};
