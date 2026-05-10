CREATE TABLE "Account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "Account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "Category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "License" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "ProductFeature" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ProductKey" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"productId" text NOT NULL,
	"userId" text,
	"status" text DEFAULT 'UNUSED' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ProductKey_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "ProductRequirement" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"os" text,
	"ram" text,
	"storage" text,
	"other" text
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" text PRIMARY KEY NOT NULL,
	"sku" text,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"promoPrice" numeric(10, 2),
	"type" text DEFAULT 'PAID' NOT NULL,
	"categoryId" text,
	"licenseId" text,
	"version" text DEFAULT '1.0.0',
	"releaseDate" timestamp DEFAULT now(),
	"supportStatus" text DEFAULT 'ACTIVE',
	"image" text,
	"downloadUrl" text,
	"youtubeUrl" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Product_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Setting" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"group" text DEFAULT 'GENERAL' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"role" text DEFAULT 'USER' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "VerificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductFeature" ADD CONSTRAINT "ProductFeature_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductKey" ADD CONSTRAINT "ProductKey_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductRequirement" ADD CONSTRAINT "ProductRequirement_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_licenseId_License_id_fk" FOREIGN KEY ("licenseId") REFERENCES "public"."License"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;