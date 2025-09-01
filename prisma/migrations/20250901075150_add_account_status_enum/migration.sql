-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED');

-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "status" "public"."AccountStatus" NOT NULL DEFAULT 'ACTIVE';
