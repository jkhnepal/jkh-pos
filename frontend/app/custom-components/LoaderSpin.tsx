"use client";
import { Loader } from "lucide-react";
import React from "react";

type Props = {
  size?: number;
};

export default function LoaderSpin({ size = 16 }: Props) {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader
        size={size}
        className="animate-spin"
      />
    </div>
  );
}
