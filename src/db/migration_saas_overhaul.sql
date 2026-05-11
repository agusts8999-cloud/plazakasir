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
ON CONFLICT DO NOTHING;

-- 3. Migrate Users from Member (Staff/Admins)
INSERT INTO "users" ("id", "full_name", "username", "email", "phone", "password_hash", "is_super_admin", "created_at")
SELECT 
  id::uuid, 
  name, 
  username, 
  email, 
  phone, 
  password, 
  (CASE WHEN type = 'ADMIN' THEN true ELSE false END),
  createdAt
FROM "Member"
ON CONFLICT ("id") DO UPDATE SET "password_hash" = EXCLUDED."password_hash";

-- 4. Create Business Users (Link migrated users to Master Business)
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
SELECT '00000000-0000-0000-0000-000000000001', id::uuid, true FROM "users"
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
SELECT id::uuid, '00000000-0000-0000-0000-000000000001', name, slug FROM "Category"
ON CONFLICT DO NOTHING;

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
SELECT id::uuid, '00000000-0000-0000-0000-000000000001', "categoryId"::uuid, sku, name, description, price, "isActive", "createdAt" FROM "Product"
ON CONFLICT DO NOTHING;

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

-- For now, members who are CUSTOMER type go here
INSERT INTO "customers" ("id", "business_id", "code", "name", "email", "phone", "address", "created_at")
SELECT id::uuid, '00000000-0000-0000-0000-000000000001', code, name, email, phone, address, createdAt 
FROM "Member" WHERE type = 'CUSTOMER'
ON CONFLICT DO NOTHING;

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
SELECT id::uuid, '00000000-0000-0000-0000-000000000001', "userId"::uuid, action, details, "ipAddress", "createdAt" FROM "ActivityLog"
ON CONFLICT DO NOTHING;
