"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GenericSubmitTeamModalProps<T> {
  modalTitle: string;
  modalDescription: string;
  SubmitTeamComponent: React.ComponentType<any>;
  submitTeamProps: any;
  onSignIn: () => Promise<void>;
  isUserSignedIn: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function GenericSubmitTeamModal<T>({
  modalTitle,
  modalDescription,
  SubmitTeamComponent,
  submitTeamProps,
  onSignIn,
  isUserSignedIn,
  isOpen,
  setIsOpen,
}: GenericSubmitTeamModalProps<T>) {
  if (isUserSignedIn) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Submit Team</Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] h-[95vh] max-w-none sm:w-[90vw] sm:h-[90vh] md:w-[85vw] md:h-[85vh] lg:w-[80vw] lg:h-[80vh] xl:w-[75vw] xl:h-[75vh] p-0">
          <DialogHeader className="p-4 pb-0 bg-background sticky top-0 z-10">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">
              {modalTitle}
            </DialogTitle>
            <DialogDescription>{modalDescription}</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-4 pt-0 sm:p-6 sm:pt-0">
            <SubmitTeamComponent {...submitTeamProps} />
          </div>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Button variant="secondary" onClick={onSignIn}>
        Sign in to Submit Team
      </Button>
    );
  }
}
