-- AlterTable
CREATE TYPE "CampaignVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

ALTER TABLE "Campaign" ADD COLUMN "visibility" "CampaignVisibility" NOT NULL DEFAULT 'PRIVATE';
ALTER TABLE "Campaign" ADD COLUMN "joinPasswordHash" TEXT;
