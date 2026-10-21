import { WorkoutApp } from "@/components/jimbro/workout-app";

export const metadata = {
  title: "JimBro — Train with a plan",
  description: "Plan your workout window, log completed sets and leave time for what comes next.",
};

export default function Home() {
  return <WorkoutApp />;
}
