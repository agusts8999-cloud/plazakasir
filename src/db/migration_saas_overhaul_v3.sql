-- Enable uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CMS & Settings Tables
CREATE TABLE IF NOT EXISTS "settings" (
  "key" text PRIMARY KEY,
  "value" text NOT NULL,
  "group" text DEFAULT 'GENERAL' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "settings" ("key", "value", "group")
SELECT "key", "value", "group" FROM "Setting"
ON CONFLICT ("key") DO NOTHING;

CREATE TABLE IF NOT EXISTS "pages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text UNIQUE NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "pages" ("id", "slug", "title", "content", "created_at", "updated_at")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  slug, title, content, "createdAt", "updatedAt" FROM "Page"
ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "licenses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "description" text
);

INSERT INTO "licenses" ("id", "name", "description")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  name, description FROM "License"
ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "release_infos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "content" text NOT NULL,
  "estimate_date" text
);

INSERT INTO "release_infos" ("id", "title", "content", "estimate_date")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  title, content, "estimateDate" FROM "ReleaseInfo"
ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "product_features" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" uuid REFERENCES "products"("id") ON DELETE CASCADE NOT NULL,
  "name" text NOT NULL
);

INSERT INTO "product_features" ("id", "product_id", "name")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  (CASE WHEN "productId" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN "productId"::uuid ELSE uuid_generate_v5(uuid_nil(), "productId") END),
  name FROM "ProductFeature"
ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "product_requirements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" uuid REFERENCES "products"("id") ON DELETE CASCADE NOT NULL,
  "os" text,
  "ram" text,
  "storage" text,
  "other" text
);

INSERT INTO "product_requirements" ("id", "product_id", "os", "ram", "storage", "other")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  (CASE WHEN "productId" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN "productId"::uuid ELSE uuid_generate_v5(uuid_nil(), "productId") END),
  os, ram, storage, other FROM "ProductRequirement"
ON CONFLICT ("id") DO NOTHING;
