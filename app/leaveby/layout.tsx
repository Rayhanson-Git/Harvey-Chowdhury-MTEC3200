import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeaveBy — Original course prototype",
  description: "The archived workout-to-commitment transition planner.",
};

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
