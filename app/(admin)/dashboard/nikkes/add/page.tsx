import { Suspense } from "react";
import AddNikkeForm from "@/components/admin/nikke-form";
import { NikkePreview } from "@/components/admin/nikke-preview";

export default function AddNikkePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Nikke</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <Suspense fallback={<div>Loading form...</div>}>
            <AddNikkeForm />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/2">
          <NikkePreview />
        </div>
      </div>
    </div>
  );
}
