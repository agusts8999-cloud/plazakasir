CREATE TABLE "ReleaseInfo" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"estimateDate" text
);
--> statement-breakpoint
ALTER TABLE "Product" ADD COLUMN "status" text DEFAULT 'LAUNCHED' NOT NULL;--> statement-breakpoint
ALTER TABLE "Product" ADD COLUMN "releaseInfoId" text;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_releaseInfoId_ReleaseInfo_id_fk" FOREIGN KEY ("releaseInfoId") REFERENCES "public"."ReleaseInfo"("id") ON DELETE no action ON UPDATE no action;