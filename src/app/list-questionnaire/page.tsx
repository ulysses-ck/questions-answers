import { getQuestionnaires } from "@/server/queries/questionnaire.query";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Link from "next/link";

export default async function Page() {
    const questionnaires = await getQuestionnaires();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Questionnaires</h1>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <QuestionnaireList questionnaires={questionnaires} />
            </div>
        </div>
    );
}

function QuestionnaireList({ questionnaires }: {
    questionnaires: {
        id: number;
        question: string;
    }[]
}) {
    return questionnaires.map((questionnaire) => (
        <Link href={`/${questionnaire.id}`} key={questionnaire.id}>
            <Card className="hover:scale-105 transition-transform cursor-pointer">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">Question #{questionnaire.id}</p>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <p className="font-medium">{questionnaire.question}</p>
                </CardBody>
            </Card>
        </Link>
    ));
}
