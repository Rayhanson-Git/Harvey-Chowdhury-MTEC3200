import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JimBro — Time well lifted",
    short_name: "JimBro",
    description: "Plan your window. Log your workout. Leave on time.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0d0f",
    theme_color: "#0c0d0f",
    icons: [192, 512].map((size) => ({
      src: `/brand/icon-${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose: "any",
    })),
  };
}
