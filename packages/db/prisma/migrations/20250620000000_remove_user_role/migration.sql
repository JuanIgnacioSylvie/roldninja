-- Remove global role from User; role is per-campaign (DM via dmId, player via membership)
ALTER TABLE "User" DROP COLUMN IF EXISTS "role";
DROP TYPE IF EXISTS "Role";
