import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeaveBy — Original course prototype",
  description: "Archived workout-to-commitment scheduling prototype.",
};

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
