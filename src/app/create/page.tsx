"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import CreateQuestionnaireForm from "@/components/create-questionnaire-form";

export default function CreateQuestionnairePage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Questionnaire</h1>
        </CardHeader>
        <CardBody>
          <CreateQuestionnaireForm />
        </CardBody>
      </Card>
    </div>
  );
} 