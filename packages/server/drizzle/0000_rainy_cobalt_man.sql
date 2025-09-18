CREATE TABLE "electricity" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "electricity_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"timestamp" bigint NOT NULL,
	"value" numeric(18, 16) NOT NULL,
	"sum" numeric(24, 16) NOT NULL,
	CONSTRAINT "electricity_timestamp_unique" UNIQUE("timestamp")
);
