export const BRAND = {
  name: "TaskFlow",
  tagline: "Your tasks, finally under control.",
  description:
    "TaskFlow brings clarity to your day with real-time sync, smart filtering, and a workspace that's entirely yours.",
} as const;

export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Sign In", href: "/auth", key: "signin" },
];

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type FilterType = "all" | "active" | "completed";