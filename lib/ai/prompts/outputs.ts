const curr = {
  withMarkdown: {
    jobTitle: "Senior Full-Stack Engineer",
    companyName: "Railway",
    location: "Remote (anywhere)",
    salaryInfo: "N/A",
    keyTechnologies: ["TypeScript", "GraphQL", "Rust", "Temporal", "Nixpacks"],
    keySkills: [
      "End-to-end feature development",
      "UI and UX design collaboration",
      "API development and data modeling",
      "Writing Engineering Requirement Documents",
      "Managing complex asynchronous backend jobs",
      "Frontend architecture knowledge",
      "Great written and verbal communication",
    ],
    culture:
      "High autonomy and ownership, globally distributed team, startup environment with high impact roles, focus on novel problems and creative solutions, opportunities for growth within the company.",
  },
  stripped: {
    jobTitle: "Senior Full-Stack Engineer",
    companyName: "Railway",
    location: "Remote (anywhere)",
    salaryInfo: "N/A",
    keyTechnologies: [
      "TypeScript",
      "GraphQL",
      "Rust",
      "Nixpacks",
      "Temporal",
      "UI/UX Design",
      "Microservices",
    ],
    keySkills: [
      "End-to-end feature development",
      "Crafting intuitive interfaces",
      "Building and modeling data APIs",
      "Writing Engineering Requirement Documents",
      "Managing complex asynchronous backend jobs",
      "Autonomous project leadership",
      "Strong communication skills",
      "Frontend architecture understanding",
      "Backend pipeline management",
    ],
    culture:
      "High impact and agency, direct effect on company culture and trajectory. Strong emphasis on autonomy, ownership, and growth. Diverse, globally distributed team with a focus on balancing work and life boundaries. Encourages creative solutions and novel problem-solving.",
  },
};

// function to strip markdown and new lines from a string.
const stripMarkdown = (str: string): string => {
  return str.replace(/`/g, "").replace(/\n/g, " ");
};
