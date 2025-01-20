"use client";
import { StickyScroll } from "./ui/sticky-scroll-reveal";

const content = [
    {
      title: "Conduct Hackathons",
      description:
        "Easily organize and manage hackathons with our platform. Create events, manage participants, and provide real-time updates to ensure a seamless experience for organizers and participants alike.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
          Host and Manage Hackathons
        </div>
      ),
    },
    {
      title: "Real-time Leaderboards",
      description:
        "Track participants' progress in real-time with our dynamic leaderboards. Provide transparency and keep the excitement alive as users see their rankings update instantly.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--red-500),var(--orange-500))] flex items-center justify-center text-white">
          Dynamic Rankings
        </div>
      ),
    },
    {
      title: "Seamless Registrations",
      description:
        "Simplify the registration process for your hackathon. Allow participants to sign up effortlessly, manage team formations, and collect all necessary details with ease.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
          Effortless Sign-ups
        </div>
      ),
    },
    {
      title: "Detailed Dashboards",
      description:
        "Access comprehensive dashboards for organizers and participants. Visualize data, track progress, and make informed decisions to ensure a successful hackathon experience.              ",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
          Insights at a Glance
        </div>
      ),
    },
    {
        title: "Many More",
        description:
          "There is no limit to the features, explore on your own and don't forget to give your valuable feedback",
        content: (
            <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--violet-500))] flex items-center justify-center text-white">
                Insights at a Glance
            </div>
        ),
    }
  ];
  
export function StickyScrollContent() {
  return (
    <div className="p-10 bg-white">
      <StickyScroll content={content} />
    </div>
  );
}