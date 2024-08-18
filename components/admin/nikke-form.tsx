// components/admin/AddNikkeForm.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nikkeSchema, type NikkeFormData } from "@/lib/types/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { ImageEditor } from "@/components/admin/image-editor";
import { useToast } from "@/components/ui/use-toast";
import { addNikke } from "@/app/(admin)/dashboard/nikkes/action";

export default function AddNikkeForm() {
  const { toast } = useToast();
  const [fullImagePath, setFullImagePath] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NikkeFormData>({
    resolver: zodResolver(nikkeSchema),
  });

  const onSubmit = async (data: NikkeFormData) => {
    const result = await addNikke(data);
    if (result.status === "success") {
      toast({
        title: "Nikke added successfully",
        description: result.message,
      });
    } else {
      toast({
        title: "Error adding Nikke",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input {...field} placeholder="Name" error={errors.name?.message} />
        )}
      />
      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <Input {...field} placeholder="Slug" error={errors.slug?.message} />
        )}
      />
      <Controller
        name="rarity"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "SSR", label: "SSR" },
              { value: "SR", label: "SR" },
              { value: "R", label: "R" },
            ]}
            placeholder="Rarity"
            error={errors.rarity?.message}
          />
        )}
      />
      <Controller
        name="element"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "Water", label: "Water" },
              { value: "Iron", label: "Iron" },
              { value: "Wind", label: "Wind" },
              { value: "Fire", label: "Fire" },
              { value: "Electric", label: "Electric" },
            ]}
            placeholder="Element"
            error={errors.element?.message}
          />
        )}
      />
      <Controller
        name="weapon_type"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "AR", label: "AR" },
              { value: "MG", label: "MG" },
              { value: "RL", label: "RL" },
              { value: "SG", label: "SG" },
              { value: "SMG", label: "SMG" },
              { value: "SR", label: "SR" },
            ]}
            placeholder="Weapon Type"
            error={errors.weapon_type?.message}
          />
        )}
      />
      <Controller
        name="burst"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "p", label: "P" },
            ]}
            placeholder="Burst"
            error={errors.burst?.message}
          />
        )}
      />
      <Controller
        name="manufacturer"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "Abnormal", label: "Abnormal" },
              { value: "Elysion", label: "Elysion" },
              { value: "Missilis", label: "Missilis" },
              { value: "Pilgrim", label: "Pilgrim" },
              { value: "Tetra", label: "Tetra" },
            ]}
            placeholder="Manufacturer"
            error={errors.manufacturer?.message}
          />
        )}
      />
      <Controller
        name="full_image_url"
        control={control}
        render={({ field }) => (
          <ImageUploader
            onImageUploaded={(path) => {
              field.onChange(path);
              setFullImagePath(path);
            }}
            folder="images/characters/body"
          />
        )}
      />
      <Controller
        name="icon_url"
        control={control}
        render={({ field }) => (
          <ImageEditor
            sourceImage={fullImagePath}
            onImageEdited={field.onChange}
            folder="images/characters/icon"
          />
        )}
      />
      <Button type="submit">Add Nikke</Button>
    </form>
  );
}
