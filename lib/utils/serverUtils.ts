import fs from "fs";
import path from "path";
import { marked } from "marked";
import { AssessmentAPIResponse, JobSummary } from "@/lib/types";

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

export function convertDBObjectToJS(
  obj: Record<string, any>
): Record<string, any> {
  const newObj: Record<string, any> = {};
  const booleanFields = ["isPrimary"];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = snakeToCamel(key);
      let value = obj[key];
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
          if (Object.keys(value)[0] == "0") {
            value = Array.from(Object.values(value));
          }
        } catch (error) {
          value = obj[key];
        }
      }
      if (booleanFields.includes(camelCaseKey)) {
        value = value === 1 ? true : false;
      }
      newObj[camelCaseKey] = value;
    }
  }
  return newObj;
}

export function convertJSToDBObject(
  obj: Record<string, any>
): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = camelToSnake(key);
      newObj[snakeKey] = obj[key];
    }
  }
  return newObj;
}

export function createSQLParams(params: Record<string, any>) {
  const dbParams = convertJSToDBObject(params);
  const keysString = Object.keys(dbParams).join(", ");
  const newParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      `$${key}`,
      // if value is array or object, stringify it
      // if value is boolean, convert to 1 or 0
      // else, return value
      Array.isArray(value) || typeof value === "object"
        ? JSON.stringify(value)
        : typeof value === "boolean"
        ? +value
        : value,
    ])
  );
  const valuesString = Object.keys(newParams).join(", ");
  return { keysString, valuesString, newParams };
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

export function isAssessmentJSON(obj: any): obj is AssessmentAPIResponse {
  return (
    typeof obj === "object" &&
    typeof obj.grade === "string" &&
    Array.isArray(obj.matchingTech) &&
    Array.isArray(obj.missingTech) &&
    Array.isArray(obj.matchingSkills) &&
    Array.isArray(obj.missingSkills)
  );
}

export function isJobSummaryJSON(obj: any): obj is JobSummary {
  if (obj === "This is not a job description.") throw Error(obj);
  return (
    typeof obj === "object" &&
    typeof obj.jobTitle === "string" &&
    typeof obj.companyName === "string" &&
    typeof obj.location === "string" &&
    typeof obj.salaryInfo === "string" &&
    Array.isArray(obj.keyTechnologies) &&
    Array.isArray(obj.keySkills) &&
    typeof obj.culture === "string"
  );
}

export function validateResponse<T>(
  response: any,
  validator: (object: any) => object is T
): boolean {
  return validator(response);
}

const stripMarkdown = (str: string): string => {
  return str.replace(/`/g, "").replace(/\n/g, " ");
};

export function extractJSON(str: string): string {
  const jsonRegex = /{.*}/g;
  const match = str.match(jsonRegex);
  console.log(match)
  if (match) {
    return match[0];
  }
  return "";
}