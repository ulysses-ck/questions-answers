"use server";

import { db } from "@/db";
import { questionnaireTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getQuestionnaires = async () => {
  const questionnaires = await db.select().from(questionnaireTable);
  return questionnaires;
};

export const getQuestionnaireById = async (id: number) => {
  const questionnaire = await db
    .select()
    .from(questionnaireTable)
    .where(eq(questionnaireTable.id, id));
  return questionnaire;
};
