import { relations } from "drizzle-orm";
import { integer, pgTable, text, boolean } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";

// Questionnaire table (main table for questions)
export const questionnaireTable = pgTable('questionnaire', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    question: text('question').notNull(),
});

// Questionnaire schemas
export const questionnaireSelectSchema = createSelectSchema(questionnaireTable);
export const questionnaireInsertSchema = createInsertSchema(questionnaireTable);
export const questionnaireUpdateSchema = createUpdateSchema(questionnaireTable);

// Answer table (stores possible answers for each question)
export const answerTable = pgTable('answer', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    text: text('answer_text').notNull(),
    isCorrect: boolean('is_correct').notNull(),
    questionnaireId: integer('questionnaire_id').references(() => questionnaireTable.id).notNull(),
});

// Answer schemas
export const answerSelectSchema = createSelectSchema(answerTable);
export const answerInsertSchema = createInsertSchema(answerTable);
export const answerUpdateSchema = createUpdateSchema(answerTable);

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

// Types inferred from schemas
export type QuestionnaireSelect = typeof questionnaireSelectSchema._type;
export type QuestionnaireInsert = typeof questionnaireInsertSchema._type;
export type QuestionnaireUpdate = typeof questionnaireUpdateSchema._type;

export type AnswerSelect = typeof answerSelectSchema._type;
export type AnswerInsert = typeof answerInsertSchema._type;
export type AnswerUpdate = typeof answerUpdateSchema._type;
