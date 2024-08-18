// components/admin/ImageUploader.tsx
"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  onImageUploaded: (path: string) => void;
  folder: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  folder,
}) => {
  const supabase = createClient();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading file:", error);
      } else {
        onImageUploaded(filePath);
      }
    },
    [onImageUploaded, folder, supabase.storage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed p-4 text-center cursor-pointer rounded-md hover:bg-gray-50 transition-colors"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag 'n' drop an image here, or click to select one</p>
      )}
    </div>
  );
};
