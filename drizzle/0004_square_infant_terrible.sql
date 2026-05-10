CREATE TABLE "Role" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"permissions" text DEFAULT '[]'
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "roleId" text;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE no action ON UPDATE no action;