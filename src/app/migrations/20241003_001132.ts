import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_camp_applications_target_group" AS ENUM('child', '12-25', '26-35', '36-45', '46-55', '56-65', '65+');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_camp_applications_nationality" AS ENUM('AF', 'AL', 'DZ', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA', 'BW', 'BR', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CF', 'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE', 'GH', 'GR', 'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MR', 'MU', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'NO', 'OM', 'PK', 'PW', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'QA', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD', 'SR', 'SZ', 'SE', 'CH', 'SY', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TO', 'TT', 'TN', 'TR', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'YE', 'ZM', 'ZW');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_camp_applications_how_did_you_learn_about_us" AS ENUM('referral', 'social media', 'church announcements');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_camp_applications_participates_in_singing" AS ENUM('Yes', 'No');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_camp_applications_type_of_group" AS ENUM('Solo performance', 'Group performance');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_camp_applications_preferred_comunication" AS ENUM('WhatsApp', 'Email');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"camp_applications_id" integer
);

CREATE TABLE IF NOT EXISTS "proof_of_payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric
);

CREATE TABLE IF NOT EXISTS "proof_of_payment_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);

CREATE TABLE IF NOT EXISTS "camp_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"targetGroup" "enum_camp_applications_target_group" NOT NULL,
	"nationality" "enum_camp_applications_nationality" NOT NULL,
	"church_organisation_name" varchar NOT NULL,
	"church_location" varchar NOT NULL,
	"other_denomination" varchar NOT NULL,
	"howDidYouLearnAboutUs" "enum_camp_applications_how_did_you_learn_about_us" NOT NULL,
	"expetations_from_conference" varchar NOT NULL,
	"additional_information" varchar NOT NULL,
	"arrival_date" timestamp(3) with time zone NOT NULL,
	"departure_date" timestamp(3) with time zone NOT NULL,
	"participatesInSinging" "enum_camp_applications_participates_in_singing" NOT NULL,
	"typeOfGroup" "enum_camp_applications_type_of_group",
	"preferredComunication" "enum_camp_applications_preferred_comunication",
	"valid_appication" boolean,
	"invalid_application_reason" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "camp_applications_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"proof_of_payment_id" integer,
	"users_id" integer
);

DROP TABLE "media";
CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" ("order");
CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" ("path");
CREATE INDEX IF NOT EXISTS "proof_of_payment_created_at_idx" ON "proof_of_payment" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "proof_of_payment_filename_idx" ON "proof_of_payment" ("filename");
CREATE INDEX IF NOT EXISTS "proof_of_payment_rels_order_idx" ON "proof_of_payment_rels" ("order");
CREATE INDEX IF NOT EXISTS "proof_of_payment_rels_parent_idx" ON "proof_of_payment_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "proof_of_payment_rels_path_idx" ON "proof_of_payment_rels" ("path");
CREATE INDEX IF NOT EXISTS "camp_applications_arrival_date_idx" ON "camp_applications" ("arrival_date");
CREATE INDEX IF NOT EXISTS "camp_applications_departure_date_idx" ON "camp_applications" ("departure_date");
CREATE INDEX IF NOT EXISTS "camp_applications_created_at_idx" ON "camp_applications" ("created_at");
CREATE INDEX IF NOT EXISTS "camp_applications_rels_order_idx" ON "camp_applications_rels" ("order");
CREATE INDEX IF NOT EXISTS "camp_applications_rels_parent_idx" ON "camp_applications_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "camp_applications_rels_path_idx" ON "camp_applications_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_camp_applications_fk" FOREIGN KEY ("camp_applications_id") REFERENCES "camp_applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "proof_of_payment_rels" ADD CONSTRAINT "proof_of_payment_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "proof_of_payment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "proof_of_payment_rels" ADD CONSTRAINT "proof_of_payment_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "camp_applications_rels" ADD CONSTRAINT "camp_applications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "camp_applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "camp_applications_rels" ADD CONSTRAINT "camp_applications_rels_proof_of_payment_fk" FOREIGN KEY ("proof_of_payment_id") REFERENCES "proof_of_payment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "camp_applications_rels" ADD CONSTRAINT "camp_applications_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric
);

DROP TABLE "users_rels";
DROP TABLE "proof_of_payment";
DROP TABLE "proof_of_payment_rels";
DROP TABLE "camp_applications";
DROP TABLE "camp_applications_rels";
CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" ("filename");`);

};
