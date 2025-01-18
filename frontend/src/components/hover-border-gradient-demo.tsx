"use client";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function HoverBorderGradientDemo() {
  return (
    <a href="/events">
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span className="font-bold">Get Started</span>
      </HoverBorderGradient>
    </div>
    </a>
  );
}