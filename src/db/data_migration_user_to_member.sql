-- Migrate Users to Members
INSERT INTO "Member" ("id", "code", "name", "email", "password", "roleId", "type", "isMainCompany", "registrationDate", "status", "createdAt", "updatedAt")
SELECT 
    id, 
    'STAFF-' || id, 
    name, 
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

-- Now we can safely add the FK to ActivityLog
ALTER TABLE "ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_userId_User_id_fk";
ALTER TABLE "ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_userId_Member_id_fk";
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_Member_id_fk" FOREIGN KEY ("userId") REFERENCES "Member"("id");
