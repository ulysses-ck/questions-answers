"use server";

import { db } from "@/db";
import { questionnaireTable, answerTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getQuestionnaires = async () => {
  const questionnaires = await db
    .select({
      id: questionnaireTable.id,
      question: questionnaireTable.question,
    })
    .from(questionnaireTable);

  return questionnaires;
};

export const getQuestionnaireById = async (id: number) => {
  const questionnaires = await db
    .select({
      id: questionnaireTable.id,
      question: questionnaireTable.question,
      answers: answerTable
    })
    .from(questionnaireTable)
    .leftJoin(answerTable, eq(answerTable.questionnaireId, questionnaireTable.id))
    .where(eq(questionnaireTable.id, id));

  if (questionnaires.length === 0) {
    return null;
  }

  // Group answers for the questionnaire
  const questionnaire = questionnaires.reduce((acc, curr) => {
    if (!acc) {
      return {
        id: curr.id,
        question: curr.question,
        answers: curr.answers ? [curr.answers] : []
      };
    }
    if (curr.answers) {
      acc.answers.push(curr.answers);
    }
    return acc;
  }, null as null | {
    id: number;
    question: string;
    answers: Array<typeof answerTable.$inferSelect>;
  });

  return questionnaire;
};
