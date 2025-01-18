"use client";
import { TypewriterEffect } from "./ui/typewriter-effect";

export function MainTitle() {
  const words = [
    {
      text: "Welcome",
    },
    {
      text: "to",
    },

    {
      text: "HackSpace.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-auto ">
      <TypewriterEffect words={words} className="text-2xl md:text-2xl lg:text-6xl" />
      <p className="text-muted text-neutral-600 dark:text-neutral-200 text-base  mb-10">
        The go-to space for Hackathons
      </p>
    </div>
  );
}