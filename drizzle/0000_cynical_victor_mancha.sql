CREATE TABLE "answer" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "answer_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"answer_text" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"questionnaire_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionnaire" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questionnaire_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"question" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_questionnaire_id_questionnaire_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaire"("id") ON DELETE no action ON UPDATE no action;