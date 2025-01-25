import { getQuestionnaireById } from "@/server/queries/questionnaire.query";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

export default async function Page({ params }: { params: Promise<{ questionnareId: string }> }) {
    const questionnareIdParam = (await params).questionnareId;
    const questionnareId = Number(questionnareIdParam);

    if (isNaN(questionnareId)) {
        return <div>Invalid questionnare id</div>
    }

    const questionnaire = await getQuestionnaireById(questionnareId);

    if (!questionnaire) {
        return <div>Questionnaire not found</div>
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Question #{questionnaire.id}</h1>
                    <p className="text-xl">{questionnaire.question}</p>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Answers:</h2>
                        <div className="space-y-3">
                            {questionnaire.answers.map((answer) => (
                                <div 
                                    key={answer.id} 
                                    className="flex items-center gap-3 p-3 rounded-lg border border-default-200"
                                >
                                    <Chip
                                        color={answer.isCorrect ? "success" : "default"}
                                        variant="flat"
                                        size="sm"
                                    >
                                        {answer.isCorrect ? "✓" : "○"}
                                    </Chip>
                                    <span className={answer.isCorrect ? "font-medium" : ""}>
                                        {answer.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}