import { getQuestionnaireById } from "@/server/queries/questionnaire.query";
import AnswerForm from "@/components/answer-form";

export default async function Page({ params }: { params: Promise<{ questionnaireId: string }> }) {
    const questionnaireIdParam = (await params).questionnaireId;
    const questionnaireId = Number(questionnaireIdParam);

    if (isNaN(questionnaireId)) {
        return <div>Invalid questionnaire id</div>
    }

    const questionnaire = await getQuestionnaireById(questionnaireId);

    if (!questionnaire) {
        return <div>Questionnaire not found</div>
    }

    // Remove isCorrect from answers before passing to client
    const clientAnswers = questionnaire.answers.map(({ id, text }) => ({
        id,
        text,
    }));

    return (
        <div className="container mx-auto p-4">
            <AnswerForm
                questionId={questionnaire.id}
                question={questionnaire.question}
                answers={clientAnswers}
            />
        </div>
    );
}