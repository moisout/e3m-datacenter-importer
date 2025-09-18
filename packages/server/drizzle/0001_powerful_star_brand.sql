ALTER TABLE "electricity" DROP CONSTRAINT "electricity_timestamp_unique";--> statement-breakpoint
ALTER TABLE "electricity" DROP COLUMN "id";
ALTER TABLE "electricity" ADD PRIMARY KEY ("timestamp");--> statement-breakpoint