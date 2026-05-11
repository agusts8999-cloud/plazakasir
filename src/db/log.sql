CREATE TABLE "ActivityLog" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"action" text NOT NULL,
	"entity" text,
	"details" text,
	"ipAddress" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
