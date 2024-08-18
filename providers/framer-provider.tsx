"use client";
import { LazyMotion, m } from "framer-motion";
import React, { ReactNode } from "react";

interface FramerProviderProps {
  children: ReactNode;
}

const loadFeatures = () =>
  import("@/lib/framer-features").then((res) => res.default);

const FramerProvider: React.FC<FramerProviderProps> = ({ children }) => {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
};

export default FramerProvider;
