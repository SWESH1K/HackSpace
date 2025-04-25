"use client";
import { ContainerScroll } from "./ui/container-scroll-animation";

export function ScrollingTablet() {
  return (
    <div className="flex flex-col overflow-hidden bg-white relative">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black">
              Organise or Participate in <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Incredible Hackathons
              </span>
            </h1>
          </>
        }
      >
        <img
          src={`https://cdn.prod.website-files.com/5db1c0d5ca3871e8fd1a7b66/5f63b112c4a60a56655cc04a_0*AbGFV7Ygi5vg-Pv_.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}