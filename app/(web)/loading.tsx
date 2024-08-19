import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
