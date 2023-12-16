import { loadFile } from "./serverUtils";
export const CURRENT_RESUME_FILENAME = "resume-1223.md";
export const RESUME_CONTENTS = loadFile(CURRENT_RESUME_FILENAME);
export const FRONTEND_SKILLS = [
  "Javascript/Typescript",
  "HTML/CSS",
  "React",
  "Angular",
  "TailwindCSS",
  "Next.js",
  "Webpack",
  "MaterialUI",
  "Bootstrap",
  "SASS",
];
export const BACKEND_SKILLS = [
  "Node",
  "Express",
  "Python",
  "SQL/Postgres",
  "Ruby/Rails",
  "DynamoDB",
  "AWS",
  "Serverless",
  "Docker",
  "Vercel",
];
export const OTHER_SKILLS = [
  "Feature scoping",
  "release planning",
  "UX design",
  "A/B testing",
  "Git",
  "Figma",
  "Analytics",
];
