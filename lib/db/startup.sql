DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS completions;
DROP TABLE IF EXISTS summaries;
DROP TABLE IF EXISTS assessments;

CREATE TABLE "jobs" (
	"id" INTEGER NOT NULL UNIQUE,
	"url" TEXT,
	"markdown" TEXT,
	"created_at" DATETIME DEFAULT (datetime('now')),
	"updated_at" DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "completions" (
	"id" INTEGER,
	"job_id" INTEGER NOT NULL,
	"provider" TEXT NOT NULL,
	"model" TEXT NOT NULL,
	"task_type" TEXT NOT NULL,
	"prompt_template" TEXT,
	"input_data" TEXT NOT NULL,
	"status" TEXT NOT NULL CHECK("status" IN ('pending', 'completed', 'failed')),
	"retries" INTEGER NOT NULL DEFAULT 0,
	"response" TEXT,
	"created_at" DATETIME DEFAULT (datetime('now')),
	"updated_at" DATETIME,
	"prompt_tokens" INTEGER,
	"completion_tokens" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT) FOREIGN KEY("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE
);

CREATE TABLE "summaries" (
	"id" INTEGER NOT NULL UNIQUE,
	"job_id" INTEGER NOT NULL,
	"completion_id" INTEGER NOT NULL,
	"is_primary" INTEGER NOT NULL DEFAULT 0,
	"job_title" TEXT,
	"company_name" TEXT,
	"location" TEXT,
	"salary_info" TEXT,
	"key_technologies" TEXT,
	"key_skills" TEXT,
	"culture" TEXT,
	"created_at" DATETIME DEFAULT (datetime('now')),
	"updated_at" DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE FOREIGN KEY("completion_id") REFERENCES "completions"("id") ON DELETE CASCADE
);

CREATE TABLE "assessments" (
	"id" INTEGER NOT NULL UNIQUE,
	"job_id" INTEGER NOT NULL,
	"completion_id" INTEGER NOT NULL,
	"is_primary" INTEGER NOT NULL DEFAULT 0,
	"grade" TEXT,
	"missing_tech" TEXT,
	"matching_tech" TEXT,
	"missing_skills" TEXT,
	"matching_skills" TEXT,
	"key_skills" TEXT,
	"culture" TEXT,
	"created_at" DATETIME DEFAULT (datetime('now')),
	"updated_at" DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE FOREIGN KEY("completion_id") REFERENCES "completions"("id") ON DELETE CASCADE
);