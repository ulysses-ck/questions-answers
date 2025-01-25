import { relations } from "drizzle-orm";
import { integer, pgTable, text, boolean } from "drizzle-orm/pg-core";

// Questionnaire table (main table for questions)
export const questionnaireTable = pgTable('questionnaire', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    question: text('question').notNull(),
});

// Answer table (stores possible answers for each question)
export const answerTable = pgTable('answer', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    text: text('answer_text').notNull(),
    isCorrect: boolean('is_correct').notNull(),
    questionnaireId: integer('questionnaire_id').references(() => questionnaireTable.id).notNull(),
});

// Define relations
export const questionnaireRelations = relations(questionnaireTable, ({ many }) => ({
    answers: many(answerTable),
}));

export const answerRelations = relations(answerTable, ({ one }) => ({
    questionnaire: one(questionnaireTable, {
        fields: [answerTable.questionnaireId],
        references: [questionnaireTable.id],
    }),
}));