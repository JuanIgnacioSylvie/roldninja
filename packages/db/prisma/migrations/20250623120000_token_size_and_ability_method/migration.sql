-- CreateEnum
CREATE TYPE "AbilityScoreMethod" AS ENUM ('POINT_BUY', 'STANDARD_ARRAY');

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN "abilityScoreMethod" "AbilityScoreMethod" NOT NULL DEFAULT 'POINT_BUY';

-- AlterTable (Tiny creatures use 0.5 grid cells; Int truncated to 0 and broke token placement)
ALTER TABLE "Token" ALTER COLUMN "size" SET DATA TYPE DOUBLE PRECISION USING "size"::double precision;
UPDATE "Token" SET "size" = 0.5 WHERE "size" < 0.5;
