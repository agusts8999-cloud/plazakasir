-- Add new columns to Member table
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "username" text;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "password" text;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "roleId" text;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "isMainCompany" boolean DEFAULT false NOT NULL;

-- Create unique constraint for username
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Member_username_unique') THEN
        ALTER TABLE "Member" ADD CONSTRAINT "Member_username_unique" UNIQUE ("username");
    END IF;
END $$;

-- Update ActivityLog foreign key (optional but good for consistency)
-- Note: We can't easily change the FK constraint without dropping it first, 
-- but we can just update the data references.
ALTER TABLE "ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_userId_User_id_fk";
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_Member_id_fk" FOREIGN KEY ("userId") REFERENCES "Member"("id");
