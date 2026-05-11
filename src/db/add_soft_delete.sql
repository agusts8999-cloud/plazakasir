ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
ALTER TABLE "License" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
ALTER TABLE "ReleaseInfo" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
