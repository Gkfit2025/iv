export const THEMES = [
  "education",
  "childcare",
  "medical",
  "wildlife",
  "environment",
  "community",
  "heritage",
  "women-empowerment",
  "construction",
  "sports",
] as const

export const THEME_LABELS: Record<(typeof THEMES)[number], string> = {
  education: "Education & Teaching",
  childcare: "Childcare & Youth Development",
  medical: "Healthcare & Medical",
  wildlife: "Wildlife Conservation",
  environment: "Environmental Conservation",
  community: "Community Development",
  heritage: "Arts, Culture & Heritage",
  "women-empowerment": "Women's Empowerment",
  construction: "Construction & Infrastructure",
  sports: "Sports & Recreation",
}
