"use server";

import { db } from "@/db";
import { 
  questionnaireTable, 
  answerTable,
  questionnaireInsertSchema,
  answerInsertSchema,
  questionnaireUpdateSchema,
  answerUpdateSchema,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CreateQuestionnaireWithAnswers = {
  question: string;
  answers: Array<{
    text: string;
    isCorrect: boolean;
  }>;
};

export async function createQuestionnaire(data: CreateQuestionnaireWithAnswers) {
  try {
    // Validate questionnaire data
    const questionnaireData = questionnaireInsertSchema.parse({ question: data.question });
    
    // Create questionnaire and get its ID
    const [newQuestionnaire] = await db
      .insert(questionnaireTable)
      .values(questionnaireData)
      .returning();

    // Validate and prepare answers data
    const answersData = data.answers.map(answer => ({
      text: answer.text,
      isCorrect: answer.isCorrect,
      questionnaireId: newQuestionnaire.id
    }));
    
    // Validate each answer
    answersData.forEach(answer => {
      answerInsertSchema.parse(answer);
    });

    // Insert all answers
    await db.insert(answerTable).values(answersData);

    revalidatePath('/list-questionnaire');
    return { success: true, data: newQuestionnaire };
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    return { success: false, error: 'Failed to create questionnaire' };
  }
}

export async function updateQuestionnaire(
  id: number,
  data: {
    question?: string;
    answers?: Array<{
      id?: number;
      text: string;
      isCorrect: boolean;
    }>;
  }
) {
  try {
    // Start a transaction since we're updating multiple tables
    return await db.transaction(async (tx) => {
      // Update questionnaire if question is provided
      if (data.question) {
        const questionnaireData = questionnaireUpdateSchema.parse({ question: data.question });
        await tx
          .update(questionnaireTable)
          .set(questionnaireData)
          .where(eq(questionnaireTable.id, id));
      }

      // Update answers if provided
      if (data.answers) {
        // First, get existing answers
        const existingAnswers = await tx
          .select()
          .from(answerTable)
          .where(eq(answerTable.questionnaireId, id));

        // Process each answer in the update data
        for (const answer of data.answers) {
          if (answer.id) {
            // Update existing answer
            const updateData = answerUpdateSchema.parse({
              text: answer.text,
              isCorrect: answer.isCorrect
            });
            await tx
              .update(answerTable)
              .set(updateData)
              .where(eq(answerTable.id, answer.id));
          } else {
            // Insert new answer
            const insertData = answerInsertSchema.parse({
              text: answer.text,
              isCorrect: answer.isCorrect,
              questionnaireId: id
            });
            await tx.insert(answerTable).values(insertData);
          }
        }

        // Delete answers that are not in the new data
        if (existingAnswers.length > 0) {
          const newAnswerIds = data.answers?.map((answer) => answer.id).filter(Boolean) as number[];
          const answerIdsToDelete = existingAnswers
            .filter((answer) => !newAnswerIds.includes(answer.id))
            .map((answer) => answer.id);
          
          if (answerIdsToDelete.length > 0) {
            await db.delete(answerTable).where(eq(answerTable.id, answerIdsToDelete[0]));
          }
        }
      }

      revalidatePath('/list-questionnaire');
      revalidatePath(`/${id}`);
      return { success: true };
    });
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    return { success: false, error: 'Failed to update questionnaire' };
  }
}

export async function deleteQuestionnaire(id: number) {
  try {
    // Delete answers first due to foreign key constraint
    await db.delete(answerTable).where(eq(answerTable.questionnaireId, id));
    
    // Then delete the questionnaire
    await db.delete(questionnaireTable).where(eq(questionnaireTable.id, id));
    
    revalidatePath('/list-questionnaire');
    return { success: true };
  } catch (error) {
    console.error('Error deleting questionnaire:', error);
    return { success: false, error: 'Failed to delete questionnaire' };
  }
}
