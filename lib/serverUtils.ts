import fs from "fs";
import path from "path";
import { marked } from "marked";
import { chromium } from "playwright";
import { AssessmentAPIResponse } from "@/lib/types";
import { cleanHTML } from "@/lib/parsing";

export function loadFile(fileName: string): string {
  const fullPath = path.join(process.cwd(), "lib/files", fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  return fileContents;
}

export async function convertMD(fileName: string): Promise<string> {
  const fileContents = loadFile(fileName);
  return await marked(fileContents);
}

export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

export function snakeToCamel(str: string): string {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

export function convertDBObject(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = snakeToCamel(key);
      newObj[camelCaseKey] = obj[key];
    }
  }
  return newObj;
}

export function isValidJSONString(str: string | null): boolean {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export function isValidApiResponse(obj: any): obj is AssessmentAPIResponse {
  return (
    typeof obj === "object" &&
    typeof obj.grade === "string" &&
    Array.isArray(obj.matchingTech) &&
    Array.isArray(obj.missingTech) &&
    Array.isArray(obj.matchingSkills) &&
    Array.isArray(obj.missingSkills)
  );
}
