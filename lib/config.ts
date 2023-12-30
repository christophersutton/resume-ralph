const getConfig = (key: string) => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
export const OPENAI_API_KEY = getConfig("OPENAI_API_KEY");
export const DB_LOCATION = getConfig("DB_LOCATION");
export const MISTRAL_API_KEY = getConfig("MISTRAL_API_KEY");
export const OLLAMA_ENDPOINT = getConfig("OLLAMA_ENDPOINT");
