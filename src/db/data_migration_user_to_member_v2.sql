-- Migrate Users to Members (Deduplicated by email)
INSERT INTO "Member" ("id", "code", "name", "email", "password", "roleId", "type", "isMainCompany", "registrationDate", "status", "createdAt", "updatedAt")
SELECT DISTINCT ON (email)
    id, 
    'STAFF-' || id, 
    COALESCE(name, 'Staff'), 
    email, 
    password, 
    "roleId", 
    'ADMIN', 
    false, 
    NOW(), 
    'ACTIVE', 
    NOW(), 
    NOW()
FROM "User"
ON CONFLICT ("id") DO UPDATE SET 
    "password" = EXCLUDED."password",
    "roleId" = EXCLUDED."roleId",
    "type" = 'ADMIN';

-- Fix ActivityLog references for merged users
-- If there are multiple IDs for the same email in User, we might need to remap ActivityLog.userId
UPDATE "ActivityLog" al
SET "userId" = m.id
FROM "User" u
JOIN "Member" m ON u.email = m.email
WHERE al."userId" = u.id;

-- Now add the FK
ALTER TABLE "ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_userId_User_id_fk";
ALTER TABLE "ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_userId_Member_id_fk";
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_Member_id_fk" FOREIGN KEY ("userId") REFERENCES "Member"("id");
