-- Enable uuid-ossp for deterministic UUID generation from strings if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create New Core Tables
CREATE TABLE IF NOT EXISTS "businesses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" text UNIQUE,
  "name" text NOT NULL,
  "slug" text UNIQUE NOT NULL,
  "type" text,
  "owner_name" text,
  "phone" text,
  "email" text,
  "address" text,
  "city" text,
  "province" text,
  "country" text DEFAULT 'Indonesia',
  "postal_code" text,
  "logo" text,
  "timezone" text DEFAULT 'Asia/Jakarta',
  "currency" text DEFAULT 'IDR',
  "package_type" text DEFAULT 'FREE',
  "package_expired_at" timestamp,
  "is_master" boolean DEFAULT false NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "full_name" text NOT NULL,
  "username" text UNIQUE,
  "email" text UNIQUE NOT NULL,
  "phone" text,
  "password_hash" text,
  "avatar" text,
  "last_login_at" timestamp,
  "is_super_admin" boolean DEFAULT false NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);

-- 2. Setup Master Business
INSERT INTO "businesses" ("id", "name", "slug", "is_master") 
VALUES ('00000000-0000-0000-0000-000000000001', 'PlazaKasir Central', 'plazakasir', true)
ON CONFLICT ("id") DO NOTHING;

-- 3. Migrate Users from Member (Staff/Admins)
-- Handle non-uuid IDs by creating a deterministic UUID using uuid_generate_v5
INSERT INTO "users" ("id", "full_name", "username", "email", "phone", "password_hash", "is_super_admin", "created_at")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END), 
  name, 
  username, 
  email, 
  phone, 
  password, 
  (CASE WHEN type = 'ADMIN' THEN true ELSE false END),
  "createdAt"
FROM "Member"
ON CONFLICT ("id") DO UPDATE SET "password_hash" = EXCLUDED."password_hash";

-- 4. Create Business Users
CREATE TABLE IF NOT EXISTS "business_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "business_id" uuid REFERENCES "businesses"("id") ON DELETE CASCADE NOT NULL,
  "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
  "role_id" uuid,
  "is_owner" boolean DEFAULT false NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "business_users" ("business_id", "user_id", "is_owner")
SELECT '00000000-0000-0000-0000-000000000001', id, true FROM "users"
ON CONFLICT DO NOTHING;

-- 5. Migrate Categories
CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "business_id" uuid REFERENCES "businesses"("id") ON DELETE CASCADE NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);

INSERT INTO "categories" ("id", "business_id", "name", "slug")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  '00000000-0000-0000-0000-000000000001', 
  name, 
  slug 
FROM "Category"
ON CONFLICT ("id") DO NOTHING;

-- 6. Migrate Products
CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "business_id" uuid REFERENCES "businesses"("id") ON DELETE CASCADE NOT NULL,
  "category_id" uuid REFERENCES "categories"("id"),
  "sku" text,
  "barcode" text,
  "name" text NOT NULL,
  "description" text,
  "price" decimal(12,2) DEFAULT 0 NOT NULL,
  "stock" decimal(12,2) DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);

INSERT INTO "products" ("id", "business_id", "category_id", "sku", "name", "description", "price", "is_active", "created_at")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  '00000000-0000-0000-0000-000000000001', 
  (CASE WHEN "categoryId" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN "categoryId"::uuid ELSE uuid_generate_v5(uuid_nil(), "categoryId") END),
  sku, 
  name, 
  description, 
  price, 
  "isActive", 
  "createdAt" 
FROM "Product"
ON CONFLICT ("id") DO NOTHING;

-- 7. Migrate Customers
CREATE TABLE IF NOT EXISTS "customers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "business_id" uuid REFERENCES "businesses"("id") ON DELETE CASCADE NOT NULL,
  "code" text,
  "name" text NOT NULL,
  "email" text,
  "phone" text,
  "address" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);

INSERT INTO "customers" ("id", "business_id", "code", "name", "email", "phone", "address", "created_at")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  '00000000-0000-0000-0000-000000000001', 
  code, 
  name, 
  email, 
  phone, 
  address, 
  "createdAt" 
FROM "Member" WHERE type = 'CUSTOMER'
ON CONFLICT ("id") DO NOTHING;

-- 8. Activity Logs
CREATE TABLE IF NOT EXISTS "activity_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "business_id" uuid REFERENCES "businesses"("id") ON DELETE CASCADE,
  "user_id" uuid REFERENCES "users"("id"),
  "action" text NOT NULL,
  "description" text,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "activity_logs" ("id", "business_id", "user_id", "action", "description", "ip_address", "created_at")
SELECT 
  (CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid ELSE uuid_generate_v5(uuid_nil(), id) END),
  '00000000-0000-0000-0000-000000000001', 
  (CASE WHEN "userId" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN "userId"::uuid ELSE uuid_generate_v5(uuid_nil(), "userId") END),
  action, 
  details, 
  "ipAddress", 
  "createdAt" 
FROM "ActivityLog"
ON CONFLICT ("id") DO NOTHING;
