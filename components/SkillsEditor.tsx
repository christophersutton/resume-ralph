import Markdown from "react-markdown";
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

export default function SkillsEditor() {
  const FrontEndSkills = "- **Frontend:** ".concat(FRONTEND_SKILLS.join(", "));
  const BackEndSkills = "- **Backend:** ".concat(BACKEND_SKILLS.join(", "));
  const OtherSkills = "- **General:** ".concat(OTHER_SKILLS.join(", "));
  const skills = [FrontEndSkills, BackEndSkills, OtherSkills].join("\n");
  return (
    <div className="my-4 text-slate-800">
      <h2>Skills</h2>
      <Markdown className="text-sm prose-ul:list-none -ml-7">{skills}</Markdown>
    </div>
  );
}
