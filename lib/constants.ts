import { loadFile } from "./serverUtils";
export { FRONTEND_SKILLS } from "./skills";
export { BACKEND_SKILLS } from "./skills";
export { OTHER_SKILLS } from "./skills";
export const CURRENT_RESUME_FILENAME = 'resume-1223.md'
export const RESUME_CONTENTS = loadFile(CURRENT_RESUME_FILENAME)

