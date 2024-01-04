import { classNames } from "@/lib/utils/clientUtils";
import { useState } from "react";
import { Spinner } from "./ui/Spinner";
import { Button } from "./ui/Button";

export const FRONTEND_SKILLS = [
  "JS",
  "JavaScript/TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "CSS3",
  "React",
  "TailwindCSS",
  "Next.js",
  "React Hooks",
  "Webpack",
  "Babel",
  "Redux",
  "MaterialUI",
  "Bootstrap",
  "Angular",
  "Vue.js",
  "Svelte",
  "Styled Components",
  "SASS",
  "LESS",
  "JQuery",
  "Apollo GraphQL",
  "Nuxt.js",
  "PWA (Progressive Web Apps)",
  "Responsive Design",
  "Cross-Browser Development",
  "ES6/ES7",
  "TypeScript",
  "WebSockets",
  "RxJS",
  "Storybook",
  "Axios",
  "GraphQL",
  "Firebase",
  "Jest",
  "Cypress",
  "Accessibility Standards",
];

export const BACKEND_SKILLS = [
  "Node",
  "Node.js",
  "Express",
  "Python",
  "SQL",
  "Postgres",
  "Ruby/Rails",
  "DynamoDB",
  "AWS",
  "Serverless",
  "Docker",
  "Vercel",
  "Heroku",
  "Netlify",
  "Azure",
  "Firebase",
  "MongoDB",
  "MySQL",
  "Redis",
  "PostgreSQL",
  "SQLite",
  "DynamoDB",
];
export const OTHER_SKILLS = [
  "Feature scoping",
  "Release planning",
  "REST Based API Design",
  "API Integration",
  "Writing Maintainable Code",
  "UX design",
  "A/B testing",
  "Documentation",
  "Technical writing",
  "Mentorship",
  "Git",
  "Figma",
  "Web Analytics",
  "SEO Optimization",
  "Adobe XD",
  "Sketch",
  "GitHub",
  "Performance Optimization",
  "Agile Methodologies",
  "Scrum",
  "Kanban",
  "Lean",
  "JIRA",
  "Trello",
];
interface SkillsEditorProps {
  jobId: number;
  editMode: boolean;
  technologies: string[];
  keyTechSkills: string[];
}

export default function SkillsEditor({
  jobId,
  editMode,
  technologies,
  keyTechSkills,
}: SkillsEditorProps) {
  const [frontendSkills, setFrontendSkills] = useState<string[]>([]);
  const [backendSkills, setBackendSkills] = useState<string[]>([]);
  const [otherSkills, setOtherSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function generateList(skills: string[], desiredSkills: string[]) {
    try {
      setLoading(true);
      const response = await fetch("/api/resume_edits/tech_list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          myTechnologies: skills,
          jobTechnologies: desiredSkills,
          model: "gpt-3.5-turbo-1106",
        }),
      });
      setLoading(false);
      return response.json();
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return error;
    }
  }
  async function fillOutSkills() {
    const feSkills = await generateList(FRONTEND_SKILLS, technologies);
    const beSkills = await generateList(BACKEND_SKILLS, technologies);
    const oSkills = await generateList(OTHER_SKILLS, keyTechSkills);

    setFrontendSkills(feSkills.techSkills);
    setBackendSkills(beSkills.techSkills);
    setOtherSkills(oSkills.techSkills);
  }
  return (
    <div
      className={classNames(
        editMode
          ? "my-2 p-8 -mx-6 prose-lg border-t-2 border-b-2 border-slate-300 drop-shadow-lg"
          : "my-12"
      )}
    >
      <div className="flex justify-between">
        <h2>Skills</h2>
        {editMode && (
          <Button
            onClick={() => fillOutSkills()}
            text={"Fill Out Skills"}
          ></Button>
        )}
      </div>
      <ul>
        <SkillItemList
          skills={frontendSkills}
          loading={loading}
          label="Frontend: "
        />
        <SkillItemList
          skills={backendSkills}
          loading={loading}
          label="Backend: "
        />
        <SkillItemList skills={otherSkills} loading={loading} label="Other: " />
      </ul>
    </div>
  );
}

const SkillItemList: React.FC<{
  skills: string[];
  loading: boolean;
  label: string;
}> = ({ skills, loading, label }) => {
  return (
    <li className="-ml-8 space-x-1 list-none">
      <span className="font-bold">{label}</span>{" "}
      {loading && (
        <span className="inline-flex">
          <Spinner size="4" />
        </span>
      )}
      {skills.length > 0 && <span>{skills.join(", ")}</span>}
    </li>
  );
};
