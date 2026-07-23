export type TechMeta = {
  /** Iconify icon id, e.g. simple-icons:react */
  icon: string;
  /** Brand hex color */
  color: string;
};

/** Normalize labels for lookup: "Next.js" → "nextjs", "C#" → "csharp" */
export function normalizeTechKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/\.js$/i, "js")
    .replace(/[^a-z0-9+#.]/g, "")
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/\./g, "");
}

const TECH_MAP: Record<string, TechMeta> = {
  // Languages
  typescript: { icon: "simple-icons:typescript", color: "#3178C6" },
  javascript: { icon: "simple-icons:javascript", color: "#F7DF1E" },
  python: { icon: "simple-icons:python", color: "#3776AB" },
  go: { icon: "simple-icons:go", color: "#00ADD8" },
  golang: { icon: "simple-icons:go", color: "#00ADD8" },
  csharp: { icon: "simple-icons:csharp", color: "#512BD4" },

  // Frontend frameworks
  react: { icon: "simple-icons:react", color: "#61DAFB" },
  reactjs: { icon: "simple-icons:react", color: "#61DAFB" },
  vue: { icon: "simple-icons:vuedotjs", color: "#4FC08D" },
  vuedotjs: { icon: "simple-icons:vuedotjs", color: "#4FC08D" },
  nextjs: { icon: "simple-icons:nextdotjs", color: "#000000" },
  nextdotjs: { icon: "simple-icons:nextdotjs", color: "#000000" },
  nuxt: { icon: "simple-icons:nuxtdotjs", color: "#00DC82" },
  nuxtdotjs: { icon: "simple-icons:nuxtdotjs", color: "#00DC82" },
  nestjs: { icon: "simple-icons:nestjs", color: "#E0234E" },
  flutter: { icon: "simple-icons:flutter", color: "#02569B" },
  astro: { icon: "simple-icons:astro", color: "#FF5D01" },
  tailwind: { icon: "simple-icons:tailwindcss", color: "#06B6D4" },
  tailwindcss: { icon: "simple-icons:tailwindcss", color: "#06B6D4" },

  // Data / APIs
  graphql: { icon: "simple-icons:graphql", color: "#E10098" },
  postgresql: { icon: "simple-icons:postgresql", color: "#4169E1" },
  postgres: { icon: "simple-icons:postgresql", color: "#4169E1" },
  mssql: { icon: "simple-icons:microsoftsqlserver", color: "#CC2927" },
  microsoftsqlserver: {
    icon: "simple-icons:microsoftsqlserver",
    color: "#CC2927",
  },
  supabase: { icon: "simple-icons:supabase", color: "#3FCF8E" },
  bullmq: { icon: "simple-icons:redis", color: "#FF4438" },

  // Cloud / devops
  aws: { icon: "simple-icons:amazonwebservices", color: "#FF9900" },
  amazonwebservices: {
    icon: "simple-icons:amazonwebservices",
    color: "#FF9900",
  },
  gcp: { icon: "simple-icons:googlecloud", color: "#4285F4" },
  googlecloud: { icon: "simple-icons:googlecloud", color: "#4285F4" },
  docker: { icon: "simple-icons:docker", color: "#2496ED" },
  stripe: { icon: "simple-icons:stripe", color: "#635BFF" },

  // .NET
  aspnetcore: { icon: "simple-icons:dotnet", color: "#512BD4" },
  dotnet: { icon: "simple-icons:dotnet", color: "#512BD4" },

  // Blog / soft tags
  frontend: { icon: "mdi:monitor-shimmer", color: "#4a7c8c" },
  portfolio: { icon: "mdi:briefcase-outline", color: "#5a9a8e" },
  intro: { icon: "mdi:hand-wave-outline", color: "#5a9a8e" },
  modernization: { icon: "mdi:rocket-launch-outline", color: "#4a7c8c" },
};

export function getTechMeta(label: string): TechMeta | undefined {
  const key = normalizeTechKey(label);
  return TECH_MAP[key];
}
