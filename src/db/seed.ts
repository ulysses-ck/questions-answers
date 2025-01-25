import { db } from "./index";
import { questionnaireTable, answerTable } from "./schema";
import { faker } from "@faker-js/faker";

type QuizQuestion = {
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
};

// Generate quiz questions using faker
function generateQuizQuestions(count: number): QuizQuestion[] {
    const categories = [
        {
            generator: () => ({
                question: `What is the capital of ${faker.location.country()}?`,
                correctAnswer: faker.location.city(),
                wrongAnswers: Array.from({ length: 2 }, () => faker.location.city())
            })
        },
        {
            generator: () => {
                const company = faker.company.name();
                return {
                    question: `Who is the CEO of ${company}?`,
                    correctAnswer: faker.person.fullName(),
                    wrongAnswers: Array.from({ length: 2 }, () => faker.person.fullName())
                };
            }
        },
        {
            generator: () => {
                const year = faker.number.int({ min: 1900, max: 2000 });
                return {
                    question: `What significant historical event occurred in ${year}?`,
                    correctAnswer: faker.lorem.sentence(),
                    wrongAnswers: Array.from({ length: 2 }, () => faker.lorem.sentence())
                };
            }
        }
    ];

    return Array.from({ length: count }, () => {
        const category = faker.helpers.arrayElement(categories);
        return category.generator();
    });
}

async function seed() {
    try {
        // Generate 10 random quiz questions
        const quizQuestions = generateQuizQuestions(10);

        for (const quizQuestion of quizQuestions) {
            // Insert question
            const [question] = await db.insert(questionnaireTable).values({
                question: quizQuestion.question,
            }).returning();

            // Insert answers for the question
            const answers = [
                {
                    text: quizQuestion.correctAnswer,
                    isCorrect: true,
                    questionnaireId: question.id,
                },
                ...quizQuestion.wrongAnswers.map(wrongAnswer => ({
                    text: wrongAnswer,
                    isCorrect: false,
                    questionnaireId: question.id,
                }))
            ];

            // Shuffle answers to randomize their order
            const shuffledAnswers = faker.helpers.shuffle(answers);
            await db.insert(answerTable).values(shuffledAnswers);
        }

        console.log("Seed completed successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}

// Execute the seed function
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
