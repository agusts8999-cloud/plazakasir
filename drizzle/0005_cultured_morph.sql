CREATE TABLE "Member" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"businessName" text,
	"businessCategoryId" text,
	"address" text,
	"phone" text,
	"email" text NOT NULL,
	"website" text,
	"registrationDate" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Member_code_unique" UNIQUE("code"),
	CONSTRAINT "Member_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Purchase" (
	"id" text PRIMARY KEY NOT NULL,
	"memberId" text NOT NULL,
	"productId" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'COMPLETED' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Member" ADD CONSTRAINT "Member_businessCategoryId_Category_id_fk" FOREIGN KEY ("businessCategoryId") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_memberId_Member_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "role";