import { Card, CardBody } from "@heroui/react";
import { getQuestionnaires } from "@/server/queries/questionnaire.query";
import Link from "next/link";
import { Button } from "@heroui/button";
import DeleteQuestionnaireButton from "@/components/delete-questionnaire-button";

export default async function ListQuestionnairePage() {
    const questionnaires = await getQuestionnaires();

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Questionnaires</h1>
                <Link href="/create">
                    <Button color="primary">Create New</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {questionnaires.map((questionnaire) => (
                    <Card key={questionnaire.id}>
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl">{questionnaire.question}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/${questionnaire.id}/edit`}>
                                        <Button color="default" variant="flat">
                                            Edit
                                        </Button>
                                    </Link>
                                    <DeleteQuestionnaireButton id={questionnaire.id} />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}

                {questionnaires.length === 0 && (
                    <p className="text-center text-gray-500">No questionnaires found</p>
                )}
            </div>
        </div>
    );
}
