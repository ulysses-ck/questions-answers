import { Card, CardBody, CardHeader } from "@heroui/react";
import EditQuestionnaireForm from "@/components/edit-questionnaire-form";
import { getQuestionnaireById } from "@/server/queries/questionnaire.query";
import { notFound } from "next/navigation";

export default async function EditQuestionnairePage({
  params,
}: {
  params: Promise<{ questionnaireId: string }>;
}) {
  const questionnaireIdParam = (await params).questionnaireId;
  const questionnaireId = Number(questionnaireIdParam);

  if (isNaN(questionnaireId)) {
    return <div>Invalid questionnaire id</div>;
  }

  const questionnaire = await getQuestionnaireById(questionnaireId);

  if (!questionnaire) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Questionnaire
          </h1>
        </CardHeader>
        <CardBody className="p-6">
          <EditQuestionnaireForm questionnaire={questionnaire} />
        </CardBody>
      </Card>
    </div>
  );
} 