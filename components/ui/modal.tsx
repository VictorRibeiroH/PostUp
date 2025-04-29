"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className={cn("relative", className)}>
          {children}
        </div>
      </div>
    </div>
  );
} 